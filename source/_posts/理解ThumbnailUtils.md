---
title: 理解ThumbnailUtils
date: 2016-03-16 20:26:54
categories: android
tags: [android,util]
---

## 前言
特别喜欢系统中一些小而精的工具类，有的时候分析一下别有一番味道。
ThumbnailUtils是系统内置的一个生成缩略图的工具类，只有512行代码，网上有很多使用ThumbnailUtils的例子，刚好我个人正在整理Bitmap的相关资料，希望从中也能有所收获。

## 几个概念

#### 像素规范
系统中对缩略图的像素定义了三种规范：
```java
// frameworks/base/core/java/android/provider/MediaStoreSaver.java
// Images.Thumbnails
public static final int MINI_KIND = 1; // 512 x 384
public static final int FULL_SCREEN_KIND = 2; // 未定义
public static final int MICRO_KIND = 3; // 160 * 120
```
<!-- more-->

对于开发者，只支持MINI_KIND和MICRO_KIND两种类型。为什么是这个像素呢？因为ThumbnailUtils中定义如下：
```java
public class ThumbnailUtils {
    /* Maximum pixels size for created bitmap. */
    private static final int MAX_NUM_PIXELS_THUMBNAIL = 512 * 384;
    private static final int MAX_NUM_PIXELS_MICRO_THUMBNAIL = 160 * 120;
    private static final int UNCONSTRAINED = -1;
}
```
其中MAX_NUM_PIXELS_MICRO_THUMBNAIL的值之前是128 * 128，在4.2+版本上被调整为160 * 120，原因很简单，现在手机拍摄照片比例普遍是4：3，如果不是这个比例生成缩略图的时候需要更多的计算。

#### 尺寸规范
系统中对MINI_KIND和MICRO_KIND两种类型的图片尺寸做了限制，强调一下，是“系统”。
```java
public static final int TARGET_SIZE_MINI_THUMBNAIL = 320;
public static final int TARGET_SIZE_MICRO_THUMBNAIL = 96;
```
当然这两个字段是@hide的，是专门系统用的。
如果图片缩略图，MINI_KIND则等比例缩到360，MICRO_KIND则缩放为96 x 96的正方形（实现方法参考下面的#最合适的缩略图）
如果视频缩略图，MINI_KIND则等比例缩到512（这个512是写死在代码里的magic number），MICRO_KIND则缩放为96 x 96的正方形（实现方法参考下面的#最合适的缩略图）

#### Exif格式
> Exif是一种图像文件格式，它的数据存储与JPEG格式是完全相同的。实际上Exif格式就是在JPEG格式头部插入了数码照片的信息，包括拍摄时的光圈、快门、白平衡、ISO、焦距、日期时间等各种和拍摄条件以及相机品牌、型号、色彩编码、拍摄时录制的声音以及GPS全球定位系统数据、缩略图等。

具体元信息，可参考f/b/media/java/android/media/ExifInterface.java
这里我特别指出ExifInterface的两点，在大家工作中很有可能会碰到：
```java
/**
 * This is a class for reading and writing Exif tags in a JPEG file.
 */
public class ExifInterface {
    // 1. 方向，也就是旋转角度
    public static final String TAG_ORIENTATION = "Orientation";

    // 2. 从Exif中获取缩略图, 如果没有则返回null
    public byte[] getThumbnail() {
        synchronized (sLock) {
            return getThumbnailNative(mFilename);
        }
    }
}
```
## 最合适的缩略图
等比例缩放只需要按Bitmap.createBitmap即可，但是Thumbnail的缩略图生成算法中为了从中间截图最合适的部分，包含了裁剪的逻辑。主要分两步：
> 1. 先缩放：按照填满的思想缩放到目标大小
> 2. 再裁剪：从中间裁剪目标大小的区域

```java
/**
 * 把原始图片转化为目标大小的图片，从中间截图
 * 注意：这里我把放大的一个逻辑处理删除了，那段逻辑永远不会执行
 */
private static Bitmap transform(Matrix scaler,
        Bitmap source,
        int targetWidth,
        int targetHeight,
        int options) {
    // 是否回收原始Bitmap
    boolean recycle = (options & OPTIONS_RECYCLE_INPUT) != 0;

    // 计算是按宽度还是高度计算缩放比例
    // 这里通过高宽比计算缩放的方法，可以用填满的思维去想象一下
    float bitmapWidthF = source.getWidth();
    float bitmapHeightF = source.getHeight();

    float bitmapAspect = bitmapWidthF / bitmapHeightF;
    float viewAspect   = (float) targetWidth / targetHeight;

    if (bitmapAspect > viewAspect) {
        float scale = targetHeight / bitmapHeightF;
        if (scale < .9F || scale > 1F) {
            scaler.setScale(scale, scale);
        } else {
            scaler = null;
        }
    } else {
        float scale = targetWidth / bitmapWidthF;
        if (scale < .9F || scale > 1F) {
            scaler.setScale(scale, scale);
        } else {
            scaler = null;
        }
    }

    // 调用Bitmap.createBitmap方法按上面算出的缩放比例等比例缩小
    Bitmap b1;
    if (scaler != null) {
        // this is used for minithumb and crop, so we want to filter here.
        b1 = Bitmap.createBitmap(source, 0, 0,
                source.getWidth(), source.getHeight(), scaler, true);
    } else {
        b1 = source;
    }

    if (recycle && b1 != source) {
        source.recycle();
    }

    // 从中间裁剪最合适部分
    int dx1 = Math.max(0, b1.getWidth() - targetWidth);
    int dy1 = Math.max(0, b1.getHeight() - targetHeight);

    Bitmap b2 = Bitmap.createBitmap(
            b1,
            dx1 / 2,
            dy1 / 2,
            targetWidth,
            targetHeight);

    if (b2 != b1) {
        if (recycle || b1 != source) {
            b1.recycle();
        }
    }

    return b2;
}
```
基于上面的算法，ThumbnailUtils对外提供了如下接口生成缩略图:
```java
// options主要用于是否回收原始Bitmap
public static Bitmap extractThumbnail(Bitmap source, int width, int height, int options)
public static Bitmap extractThumbnail(Bitmap source, int width, int height)
```

## 视频缩略图
使用MediaMetadataRetriever读取视频第一帧Bitmap，然后据此再生成缩略图。
如果kind为Thumbnails.MINI_KIND，就等比例生成最大宽或者高为512的小图。
如果king为Thumbnails.MICRO_KIND，就使用上面讲的最合适的缩略图算法，生成96 x 96的正方形小图
```java
public static Bitmap createVideoThumbnail(String filePath, int kind) {
    Bitmap bitmap = null;
    MediaMetadataRetriever retriever = new MediaMetadataRetriever();
    try {
        retriever.setDataSource(filePath);
        bitmap = retriever.getFrameAtTime(-1);
    } catch (IllegalArgumentException ex) {
        // Assume this is a corrupt video file
    } catch (RuntimeException ex) {
        // Assume this is a corrupt video file.
    } finally {
        try {
            retriever.release();
        } catch (RuntimeException ex) {
            // Ignore failures while cleaning up.
        }
    }

    if (bitmap == null) return null;

    if (kind == Images.Thumbnails.MINI_KIND) {
        // Scale down the bitmap if it's too large.
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        int max = Math.max(width, height);
        if (max > 512) {
            float scale = 512f / max;
            int w = Math.round(scale * width);
            int h = Math.round(scale * height);
            bitmap = Bitmap.createScaledBitmap(bitmap, w, h, true);
        }
    } else if (kind == Images.Thumbnails.MICRO_KIND) {
        bitmap = extractThumbnail(bitmap,
                TARGET_SIZE_MICRO_THUMBNAIL,
                TARGET_SIZE_MICRO_THUMBNAIL,
                OPTIONS_RECYCLE_INPUT);
    }
    return bitmap;
}
```
## 内部方法
ThumbnailUtils其实对外的方法就上面三个演示的三个方法，除此之外，内部还有两部分，一部分是生成图片文件的缩略图，另外一部分就是未使用的无用代码。

## 计算SampleSize
系统中新加入一张图，就要生成缩略图了，最重要的就是计算SampleSize了，ThumbnailUtils提供了两种算法：
#### 按目标最小边(minSideLength)
> 定义最小边的缩放比例
> (int) Math.min(Math.floor(w / minSideLength), Math.floor(h / minSideLength))

#### 按目标像素(maxNumOfPixels)
> 定义像素的缩放比例
> (int) Math.ceil(Math.sqrt(w * h / maxNumOfPixels))

#### 具体实现
同时支持不指定限制，也做了一个默认值处理，实现如下：
```java
// 计算缩放比例
private static int computeInitialSampleSize(BitmapFactory.Options options,
        int minSideLength, int maxNumOfPixels) {
    double w = options.outWidth;
    double h = options.outHeight;

    int lowerBound = (maxNumOfPixels == UNCONSTRAINED) ? 1 :
        (int) Math.ceil(Math.sqrt(w * h / maxNumOfPixels));
    int upperBound = (minSideLength == UNCONSTRAINED) ? 128 :
        (int) Math.min(Math.floor(w / minSideLength),
                Math.floor(h / minSideLength));

    if (upperBound < lowerBound) {
        // return the larger one when there is no overlapping zone.
        return lowerBound;
    }

    if ((maxNumOfPixels == UNCONSTRAINED) &&
            (minSideLength == UNCONSTRAINED)) {
        return 1;
    } else if (minSideLength == UNCONSTRAINED) {
        return lowerBound;
    } else {
        return upperBound;
    }
}
```
但是上面的缩放比例不是标准的2的次放，不符合BitmapFactory的规范，再封装一下：
```java
// 规范化上面的sampleSize为2的次方或者8的倍数
// 据说这是BitmapFactory的要求，可以避免OOM？注释里说的。
private static int computeSampleSize(BitmapFactory.Options options,
        int minSideLength, int maxNumOfPixels) {
    int initialSize = computeInitialSampleSize(options, minSideLength,
            maxNumOfPixels);

    int roundedSize;
    if (initialSize <= 8) {
        // 如果小于8，转化为2的次方（通过位移来转化，可以借鉴一下）
        roundedSize = 1;
        while (roundedSize < initialSize) {
            roundedSize <<= 1;
        }
    } else {
        // 如果大于8，转化为8的倍数
        roundedSize = (initialSize + 7) / 8 * 8;
    }

    return roundedSize;
}
```

## 从EXIF中选取缩略图
只支持JPG中读取EXIF信息。
这里不是说EXIF有缩略图就用这个缩略图，而是会先用高宽算出文件本身的TargetSize对应的缩略图，和EXIF中缩放到TargetSize对应的缩略图比较，哪个大取哪个。
```java
/**
 * Creates a bitmap by either downsampling from the thumbnail in EXIF or the full image.
 * The functions returns a SizedThumbnailBitmap,
 * which contains a downsampled bitmap and the thumbnail data in EXIF if exists.
 */
private static void createThumbnailFromEXIF(String filePath, int targetSize,
        int maxPixels, SizedThumbnailBitmap sizedThumbBitmap) {
    if (filePath == null) return;

    ExifInterface exif = null;
    byte [] thumbData = null;
    try {
        exif = new ExifInterface(filePath);
        thumbData = exif.getThumbnail();
    } catch (IOException ex) {
        Log.w(TAG, ex);
    }

    BitmapFactory.Options fullOptions = new BitmapFactory.Options();
    BitmapFactory.Options exifOptions = new BitmapFactory.Options();
    int exifThumbWidth = 0;
    int fullThumbWidth = 0;

    // Compute exifThumbWidth.
    if (thumbData != null) {
        exifOptions.inJustDecodeBounds = true;
        BitmapFactory.decodeByteArray(thumbData, 0, thumbData.length, exifOptions);
        exifOptions.inSampleSize = computeSampleSize(exifOptions, targetSize, maxPixels);
        exifThumbWidth = exifOptions.outWidth / exifOptions.inSampleSize;
    }

    // Compute fullThumbWidth.
    fullOptions.inJustDecodeBounds = true;
    BitmapFactory.decodeFile(filePath, fullOptions);
    fullOptions.inSampleSize = computeSampleSize(fullOptions, targetSize, maxPixels);
    fullThumbWidth = fullOptions.outWidth / fullOptions.inSampleSize;

    // Choose the larger thumbnail as the returning sizedThumbBitmap.
    if (thumbData != null && exifThumbWidth >= fullThumbWidth) {
        int width = exifOptions.outWidth;
        int height = exifOptions.outHeight;
        exifOptions.inJustDecodeBounds = false;
        sizedThumbBitmap.mBitmap = BitmapFactory.decodeByteArray(thumbData, 0,
                thumbData.length, exifOptions);
        if (sizedThumbBitmap.mBitmap != null) {
            sizedThumbBitmap.mThumbnailData = thumbData;
            sizedThumbBitmap.mThumbnailWidth = width;
            sizedThumbBitmap.mThumbnailHeight = height;
        }
    } else {
        fullOptions.inJustDecodeBounds = false;
        sizedThumbBitmap.mBitmap = BitmapFactory.decodeFile(filePath, fullOptions);
    }
}
```

## 图片文件缩略图
如果是MINI_KIND，尺寸最小边缩放到320左右，像素缩放到512 x 387。否则就是MICRO_KIND，尺寸最大边缩放到96，像素所放到160 x 120。
如果图片是JPG，参考上面的方法从EXIF中选取缩略图。否则，用decodeFileDescriptor()老老实实等比例生成缩略图。
最终成功后，如果是MICRO_KIND，还要裁剪为96 x 96的正方形。
```
public static Bitmap createImageThumbnail(String filePath, int kind) {
    boolean wantMini = (kind == Images.Thumbnails.MINI_KIND);
    int targetSize = wantMini
        ? TARGET_SIZE_MINI_THUMBNAIL
        : TARGET_SIZE_MICRO_THUMBNAIL;
    int maxPixels = wantMini
        ? MAX_NUM_PIXELS_THUMBNAIL
        : MAX_NUM_PIXELS_MICRO_THUMBNAIL;
    SizedThumbnailBitmap sizedThumbnailBitmap = new SizedThumbnailBitmap();
    Bitmap bitmap = null;
    MediaFileType fileType = MediaFile.getFileType(filePath);
    if (fileType != null && fileType.fileType == MediaFile.FILE_TYPE_JPEG) {
        createThumbnailFromEXIF(filePath, targetSize, maxPixels, sizedThumbnailBitmap);
        bitmap = sizedThumbnailBitmap.mBitmap;
    }

    if (bitmap == null) {
        FileInputStream stream = null;
        try {
            stream = new FileInputStream(filePath);
            FileDescriptor fd = stream.getFD();
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inSampleSize = 1;
            options.inJustDecodeBounds = true;
            BitmapFactory.decodeFileDescriptor(fd, null, options);
            if (options.mCancel || options.outWidth == -1
                    || options.outHeight == -1) {
                return null;
            }
            options.inSampleSize = computeSampleSize(
                    options, targetSize, maxPixels);
            options.inJustDecodeBounds = false;

            options.inDither = false;
            options.inPreferredConfig = Bitmap.Config.ARGB_8888;
            bitmap = BitmapFactory.decodeFileDescriptor(fd, null, options);
        } catch (IOException ex) {
            Log.e(TAG, "", ex);
        } catch (OutOfMemoryError oom) {
            Log.e(TAG, "Unable to decode file " + filePath + ". OutOfMemoryError.", oom);
        } finally {
            try {
                if (stream != null) {
                    stream.close();
                }
            } catch (IOException ex) {
                Log.e(TAG, "", ex);
            }
        }

    }

    if (kind == Images.Thumbnails.MICRO_KIND) {
        // now we make it a "square thumbnail" for MICRO_KIND thumbnail
        bitmap = extractThumbnail(bitmap,
                TARGET_SIZE_MICRO_THUMBNAIL,
                TARGET_SIZE_MICRO_THUMBNAIL, OPTIONS_RECYCLE_INPUT);
    }
    return bitmap;
}
```
这里你可能注意到了，如果从EXIF的代码中获取本身文件缩略图用的是decodeFile()，而后面非JPG图片获取缩略图用decodeFileDescriptor()，为什么呢？
不知道，也许是开发者“Ray Chen”忘记了，只改了一部分，另外一部分为了稳定性也没改。
据网上资料看，decodeFileDescriptor()比decodeFile()更省内存，没有论证，仅供参考。


## 未使用的无用代码
在ThumbnailUtils有一些私有方法，但是自己又没有去调用，暂且把这些方法定位无用代码吧：
```
/**
 * Make a bitmap from a given Uri, minimal side length, and maximum number of pixels.
 * The image data will be read from specified pfd if it's not null, otherwise
 * a new input stream will be created using specified ContentResolver.
 *
 * Clients are allowed to pass their own BitmapFactory.Options used for bitmap decoding. A
 * new BitmapFactory.Options will be created if options is null.
 */
private static Bitmap makeBitmap(int minSideLength, int maxNumOfPixels,
        Uri uri, ContentResolver cr, ParcelFileDescriptor pfd,
        BitmapFactory.Options options) {
    Bitmap b = null;
    try {
        if (pfd == null) pfd = makeInputStream(uri, cr);
        if (pfd == null) return null;
        if (options == null) options = new BitmapFactory.Options();

        FileDescriptor fd = pfd.getFileDescriptor();
        options.inSampleSize = 1;
        options.inJustDecodeBounds = true;
        BitmapFactory.decodeFileDescriptor(fd, null, options);
        if (options.mCancel || options.outWidth == -1
                || options.outHeight == -1) {
            return null;
        }
        options.inSampleSize = computeSampleSize(
                options, minSideLength, maxNumOfPixels);
        options.inJustDecodeBounds = false;

        options.inDither = false;
        options.inPreferredConfig = Bitmap.Config.ARGB_8888;
        b = BitmapFactory.decodeFileDescriptor(fd, null, options);
    } catch (OutOfMemoryError ex) {
        Log.e(TAG, "Got oom exception ", ex);
        return null;
    } finally {
        closeSilently(pfd);
    }
    return b;
}

private static void closeSilently(ParcelFileDescriptor c) {
    if (c == null) return;
    try {
        c.close();
    } catch (Throwable t) {
        // do nothing
    }
}

private static ParcelFileDescriptor makeInputStream(
        Uri uri, ContentResolver cr) {
    try {
        return cr.openFileDescriptor(uri, "r");
    } catch (IOException ex) {
        return null;
    }
}
```

## 小结
通过学习ThumbnailUtils生成缩略图的方方面面，结合自己的经验实践，从此生成缩略图无忧。
零零散散写的有点乱，但基本上能运行到的每行代码都覆盖到了，对于理解ThumbnailUtils这个类来说，应该够了。

## 附录
[ThumbnailUtils.java源码](https://github.com/CyanogenMod/android_frameworks_base/blob/cm-12.1/media/java/android/media/ThumbnailUtils.java)
