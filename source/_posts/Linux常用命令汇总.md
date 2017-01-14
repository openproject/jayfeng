title: "Linux常用命令汇总"
date: 2016-01-06 09:42:48
categories: linux
tags: linux
---

之前在微博上看到了一款神器tldr，更友好的命令使用说明，妈妈再也不用担心我记不住命令了！今天抽空整理一下, 以备没用安装tldr的机器也能查阅常用的几个。

## 官方网站：
https://github.com/tldr-pages/tldr
![tldr man](/images/tldr_man.png)

## 命令列表
执行tldr list,得到一些常用的命令列表
```bash
ab, ack, ag, alias, apropos, ar, awk, bc, bundle, cal, calibre-server, calibredb,
cat, cd, chmod, chown, chsh, cksum, clang, comm, convert, cordova, cp, curl, cut, date, deluser,
df, diff, dig, docker, drush, ebook-convert, echo, electrum, env, exiftool, fdupes, ffmpeg,
file, find, fswebcam, gcc, gem, gifsicle,
git-add, git-blame, git-branch, git-checkout, git-clone, git-commit, git-config, git-diff, git-init,
git-log, git-merge, git-mv, git-pull, git-push, git-remote, git-rm, git-stash, git-status, git-tag, git,
gpg, grep, gzip, handbrakecli, haxelib, history, iconv, ifconfig, ioping, ipcs,
java, javac, kill, less, ln, lp, lpstat, ls, lsof, man, mkdir, more, mount, mp4box, mtr,
mv, mysql, mysqldump, nc, nginx, nice, nmap, node, nohup, npm, nvm, pandoc,
passwd, patch, pgrep, php, ping, pip, play, printf, ps, psql, pushd, pwd, python, redis-cli,
rename, renice, rm, rmdir, rsync, salt-call, salt-key, salt-run, salt, scp, screen,
sed, sort, sox, split, srm, ssh, sshfs, sudo, svn, tail, tar, tcpdump, tee,
telnet, test, time, tldr, tmux, touch, tr, traceroute, transcode, tree, ufraw-batch, umount,
uname, unzip, uptime, useradd, userdel, usermod, vim, vimtutor, w, wc,
wget, which, yes, zbarimg, zfs, zip, zpool, apt-get, aptitude, base64, dpkg,
du, emerge, findmnt, firewall-cmd, free, head, hostname, iostat, ip, journalctl,
locate, lsb_release, md5sum, mdadm, netstat, pacman, sha1sum, sha224sum, sha256sum, sha384sum, sha512sum,
shuf, shutdown, ss, strace, systemctl, tcpflow,
top, wall, watch, wpa_cli, xargs, xsetwacom, airport, brew, caffeinate, diskutil, drutil,
du, head, hostname, locate, md5, mdfind, netstat, networksetup, open, pbcopy, pbpaste, qlmanage,
route, say, shutdown, sw_vers, sysctl, system_profiler, systemsetup,
top, wacaw, xctool, xed, xsltproc, prctl, prstat, svcadm, svccfg, svcs
```

## 命令详解
按字母顺序列举。

### ack
```bash
ack
A search tool like grep, optimized for programmers.

- Find files containing "foo"
ack foo

- Find files in a specific language
ack --ruby each_with_object

- Count the total number of matches for the term "foo"
ack -ch foo

- Show the file names containing "foo" and number of matches in each file
ack -cl foo

```
<!-- more -->

### alias
```bash
alias
Creates an alias for a word when used
as the first word of a command

- creating a generic alias
alias word="command"

- remove an aliased command
unalias word

- full list of aliased words
alias -p

- turning rm an interative command
alias rm="rm -i"

- overriding la as ls -a
alias la="ls -a"
```
### awk
```bash
awk
A versatile programming language for working on files

- Print the fifth column in a space separated file
awk '{print $5}' filename

- Print the third column in a comma separated file
awk -F ',' '{print $3}' filename

- Sum the values in the first column and print the total
awk '{s+=$1} END {print s}' filename

- Sum the values in the first column and pretty-print the values and then the total
awk '{s+=$1; print $1} END {print "--------"; print s}' filename
```
### base64
```bash
base64
Encode or decode file or standard input, to standard output.

- Encode a file
base64 filename

- Decode a file
base64 -d filename

- Encode from stdin
somecommand | base64

- Decode from stdin
somecommand | base64 -d
```
### cat
```bash
cat
Print and concatenate files.

- Print the contents of  to the standard output
cat file1

- Concatenate several files into the target file.
cat file1 file2 > target-file
```
### chmod
```bash
chmod
Change the access permissions of a file or directory

- Give the (u)ser who owns a file the right to e(x)ecute it
chmod u+x file

- Give the user rights to (r)ead and (w)rite to a file/directory
chmod u+rw file

- Remove executable rights from the (g)roup
chmod g-x file

- Give (a)ll users rights to read and execute
chmod a+rx file

- Give (o)thers (not in the file owner's group) the same rights as the group
chmod o=g file
```
### chown
```bash
chown
Change the owning user/group of the specified files

- change the user of a file
chown user path/to/file

- change the user and group of a file
chown user:group path/to/file

- recursively change the owner of an entire folder
chown -R user path/to/folder

- change the owner of a symbolic link
chown -h user path/to/symlink

- use the owner and group of a reference file and apply those values to another file
chown --reference=reference-file path/to/file
```
### chsh
```bash
chsh
Change user's login shell

- change shell
chsh -s path/to/shell_binary username
```
### convert
```bash
convert
Imagemagick image conversion tool

- Convert an image from JPG to PNG
convert image.jpg image.png

- Scale an image 50% it's original size
convert image.png -resize 50% image2.png

- Horizontally append images
convert image1.png image2.png image3.png +append image123.png
```
### cp
```bash
cp
Copy files

- Copy files in arbitrary locations
cp /path/to/original /path/to/copy

- Copy a file to a parent directory
cp /path/to/original ../path/to/copy

- Copy directories recursive using the option -r
cp -r /path/to/original /path/to/copy

- Show files as they are copied
cp -vr /path/to/original /path/to/copy

- Make a copy of a file, adding an extension
cp file.html{,.backup}

- Make a copy of a file, changing the extension
cp file.{html,backup}
```
### curl
```bash
curl
Transfers data from or to a server
Supports most protocols including HTTP, FTP, POP

- Download a URL to a file
curl "URL" -o filename

- send form-encoded data
curl --data name=bob http://localhost/form

- send JSON data
curl -X POST -H "Content-Type: application/json" -d '{"name":"bob"}' http://localhost/login

- specify an HTTP method
curl -X DELETE http://localhost/item/123

- head request
curl --head http://localhost

- pass a user name and password for server authentication
curl -u myusername:mypassword http://localhost
```
### cut
```bash
cut
Cut out fields from STDIN or files

- Cut out the first sixteen characters of each line of STDIN
cut -c 1-16

- Cut out the first sixteen characters of each line of the given files
cut -c 1-16 file

- Cut out everything from the 3rd character to the end of each line
cut -c3-

- Cut out the fifth field, split on the colon character of each line
cut -d':' -f5

- Cut out the fields five and 10, split on the colon character of each line
cut -d':' -f5,10

- Cut out the fields five through 10, split on the colon character of each line
cut -d':' -f5-10
```
### date
```bash
date
Set or display the system date

- Display the date using the default locale
date +"%c"

- Display the date in UTC and ISO 8601 format
date -u +"%Y-%m-%dT%H:%M:%SZ"
```
### df
```bash
df
gives an overview of the file system disk space usage

- display all file systems and their disk usage
df

- display all file systems and their disk usage in human readable form
df -h
```
### diff
```bash
diff
Compare files and directories

- Compare files
diff file1 file2

- Compare files, ignoring white spaces
diff -w file1 file2

- Compare files, showing differences side by side
diff -y file1 file2

- Compare directories recursively
diff -r directory1 directory2

- Compare directories, only showing the names of files that differ
```
### dpkg
```bash
dpkg
debian package manager

- install a package
dpkg -i /path/to/file

- remove a package
dpkg -r package_name

- list installed packages
dpkg -l pattern

- list package contents
dpkg -L package_name
```
### du
```bash
du
Estimate file space usage

- get a sum of the total size of a file/folder in human readable units
du -sh file/directory

- list file sizes of a directory and any subdirectories in KB
du -k file/directory

- get recursively, individual file/folder sizes in human readable form
du -ah directory

- list the KB sizes of directories for N levels below the specified directory
du --max-depth=N
```
### env
```bash
env
Show the environment or run a program in a modified environment

- Show the environment
env

- Clear the environment and run a program
env -i program

- Remove variable from the environment and run a program
env -u variable program

- Set a variable and run a program
env variable=value program
```
### find
```bash
find
Find files under the given directory tree, recursively

- find files by extension
find root_path -name '*.py'

- find files matching path pattern
find root_path -path '**/lib/**/*.py'

- run a command for each file, use {} within the command to access the filename
find root_path -name '*.py' -exec wc -l {} \;

- find files modified since a certain time
find root_path -name '*.py' -mtime -1d

- find files using case insensitive name matching, of a certain size
find root_path -size +500k -size -10MB -iname '*.TaR.gZ'

- delete files by name, older than a certain number of days
find root_path -name '*.py' -mtime -180d -delete
```
### gcc
```bash
gcc
Preprocesses and compiles C and C++ source files, then assembles and links them together.

- Compile multiple source files into executable
gcc source1.c source2.c -o executable

- Allow warnings, debug symbols in output
gcc source.c -Wall -Og -o executable

- Include libraries from a different path
gcc source.c -o executable -Iheader_path -Llibrary_path -llibrary_name
```
### git ...
1. git add
```bash
git add
Adds changed files to the index

- Add a file to the index
git add PATHSPEC

- Add all files (tracked and untracked)
git add .

- Only add already tracked files
git add -u

- Also add ignored files
git add -f
```
2. git blame
```bash
git blame
Show commit hash and last author on each line of a file

- Print file with author name and commit hash on each line
git blame file

- Print file with author email and commit hash on each line
git blame -e file
```
3. git branch
```bash
Main command for working with branches

- List local branches. The current branch is highlighted by *.
git branch

- List all local and remote branches
git branch -a

- Create new branch based on current branch
git branch BRANCH-NAME

- Delete a local branch
git branch -d BRANCH-NAME

- Move/Rename a branch
git branch -mch
```
4. git checkout
```bash
git checkout
Checkout a branch or paths to the working tree

- Switch to another branch
git checkout BRANCH-NAME

- Create and switch to a new branch
git checkout -b BRANCH-NAME

- Undo unstaged local modification
git checkout .
```
5. git clone
```bash
git clone
Clone an existing repository

- Clone an existing repository
git clone REMOTE-REPOSITORY-LOCATION

- For cloning from the local machine
git clone -l

- Do it quietly
git clone -q

- Clone an existing repository, and truncate to the specified number of revisions, save your time mostly
git clone --depth 10 REMOTE-REPOSITORY-LOCATION
```
6. git commit
```bash
git commit
Commit staged files to the repository

- Commit staged files to the repository with comment
git commit -m MESSAGE

- Replace the last commit with currently staged changes
git commit --amend
```
7. git config
```bash
git config
Get and set repository or global options

- Print list of options for current repository
git config --list --local

- Print global list of options, set in ~/.gitconfig
git config --list --global

- Get full list of options
git config --list

- Get value of alias.ls option
git config alias.st

- Set option alias.ls=status in file ~/.gitconfig
git config --global alias.ls "status"

- Remove option alias.st from ~/.gitconfig
git config --global --unset alias.st
```

8. git diff
```bash
git diff
Show changes to tracked files

- Show changes to tracked files
git diff PATHSPEC

- Show only names of changed files.
git diff --name-only PATHSPEC

- Output a condensed summary of extended header information.
git diff --summary PATHSPEC
```
9. git init
```bash
git init
Initializes a new local Git repository

- Initialize a new local repository
git init

- Initialize a barebones repository
git init --bare
```
10. git log
```bash
git log
Show a history of commits

- Show a history of commits
git log

- Show the history of a particular file or directory, including differences
git log -p path

- Show only the first line of each commits
git log --oneline
```
11. git merge
```bash
git merge
Merge branches

- Merge a branch with your current branch
git merge BRANCH-NAME

- Edit the merge message
git merge -e BRANCH-NAME
```
12. git mv
```bash
git mv
Move or rename files and update the git index.

- Move file inside the repo and add the movement to the next commit
git mv path/to/file new/path/to/file

- Rename file and add renaming to the next commit
git mv filename new_filename

- Overwrite the file in the target path if it exists
git mv --force file target
```
13. git pull
```bash
git pull
Fetch branch from a remote repository and merge it to local repository

- Download changes from default remote repository and merge it
git pull

- Download changes from default remote repository and use fast forward
git pull --rebase

- Download changes from given remote repository and branch, then merge them into HEAD
git pull remote_name branch
```
14. git push
```bash
git push
Push commits to a remote repository

- Publish local changes on a remote branch
git push REMOTE-NAME LOCAL-BRANCH

- Publish local changes on a remote branch of different name
git push REMOTE-NAME LOCAL-BRANCH:REMOTE-BRANCH

- Remove remote branch
git push REMOTE-NAME :REMOTE-BRANCH

- Remove remote branches which don't exist locally
git push --prune REMOTE-NAME

- Publish tags
git push --tags
```
15. git remote
```bash
git remote
ge set of tracked repositories (“remotes”)

- Show a list of existing remotes, their names and URL
git remote -v

- Add a remote
git remote add remote_name remote_url

- Change the URL of a remote
git remote set-url remote_name new_url

- Remove a remote
git remote remove remote_name

- Rename a remote
git remote rename old_name new_name
```
16. git stash
```bash
git stash
Stash local Git changes in a temporary area

- stash current changes (except new files)
git stash save optional_stash_name

- include new files in the stash (leaves the index completely clean)
git stash save -u optional_stash_name

- list all stashes
git stash list

- re-apply the latest stash
git stash pop

- re-apply a stash by name
git stash apply stash_name

- drop a stash by an index
git stash drop stash@{index}
```
17. git tag
```bash
git tag
Create, list, delete or verify tags.
Tag is reference to specific commit.

- List all tags
git tag

- Create a tag with the given name pointing to the current commit
git tag tag_name

- Create a tag with the given message
git tag tag_name -m tag_message

- Delete the tag with the given name
git tag -d tag_name
```
### grep
```bash
grep
Matches patterns in input text
Supports simple patterns and regular expressions

- search for an exact string
grep something file_path

- search recursively in current directory for an exact string
grep -r something .

- use a regex
grep -e ^regex$ file_path

- see 3 lines of context
grep -C 3 something file_path

- print the count of matches instead of the matching text
grep -c something file_path

- use the standard input instead of a file
cat file_path | grep something

- invert match for excluding specific strings
grep -v something
```
### gzip
```bash
gzip
Compress/uncompress files with gzip compression (LZ77)

- compress a file, replacing it with a gzipped compressed version
gzip file.ext

- decompress a file, replacing it with the original uncompressed version
gzip -d file.ext.gz

- compress a file specifying the output filename
gzip -c file.ext > compressed-file.ext.gz

- uncompress a gzipped file specifying the output filename
gzip -c -d file.ext.gz > uncompressed-file.ext

- specify the compression level. 1=Fastest (Worst), 9=Slowest (Best), Default level is 6
gzip -9 -c file.ext > compressed-file.ext.gz
```
### iconv
```bash
iconv
Converts text from one encoding to another

- convert file and print to stdout
iconv -f from_encoding -t to_encoding input_file

- convert file to current locale
iconv -f from_encoding input_file > output_file

- list supported encodings
iconv -l
```
### ifconfig
```bash
ifconfig
ifconfig - Interface Configurator, used to configure network interfaces.

- View network settings of an ethernet adapter.
ifconfig eth0

- Display details of all interfaces, including disabled interfaces.
ifconfig -a

- Disable eth0 interface.
ifconfig eth0 down

- Enable eth0 interface.
ifconfig eth0 up

- Assign IP address to eth0 interface.
ifconfig eth0 ip_address
```
### kill
```bash
kill
Sends a signal to a process
Mostly used for stopping processes

- kill the process
kill process_id

- list signal names
kill -l
```
### less
```bash
less
Opens a file for reading
Allows movement and search
Doesn't read the entire file (suitable for logs)

- open a file
less source_file

    - page up / down
d (next), D (previous)

    - go to start / end of file
g (start), G (end)

    - search for a string
/something   then   n (next), N (previous)

    - exit
    q
```
### ln
```bash
ln
Creates links to files and folders

- create a symbolic link to a file or folder
ln -s path/to/original/file path/to/link

- overwrite a symbolic link to a file
ln -sf path/to/new/original/file path/to/file/link

- overwrite a symbolic link to a folder
ln -sfT path/to/new/original/file path/to/folder/link

- create a hard link to a file or folder
ln path/to/original/file path/to/link
```
### locate
```bash
locate
find filenames quickly
- Look for pattern in the database. Note: the database is recomputed periodically (usually weekly or daily).
locate pattern

- Recompute the database. You need to do it if you want to find recently added files.
sudo updatedb
```
### ls
```bash
ls
List directory contents

- List all files, even hidden
ls -a

- List all file names (no extra info)
ls -A1

- List all files with their rights, groups, owner
ls -l

- List all files and display the file size in a human readable format
ls -lh

- List all files with a prefix/suffix
ls *suffix

- Sort the results by size, last modified date, or creation date
ls -U

- Reverse the order of the results
ls -r
```
### md5 ...
md5sum, sha1sum, sha224sum, sha256sum, sha384sum, sha512sum etc.
```bash
md5sum
Calculate MD5 cryptographic checksums

- Read a file of MD5SUMs and verify all files have matching checksums
md5sum -c filename.md5
```
### mkdir
```bash
mkdir
Creates a directory

- creates a directory in current folder or given path
mkdir directory

- creates directories recursively (useful for creating nested dirs)
    mkdir -p path
```
### more
```bash
more
Opens a file for reading.
Allows movement and search in forward direction only.
Doesn't read the entire file (suitable for logs)

- open a file
more source_file

- page down
d (next)

- search for a string
/something   then   n (next)

- exit
q
```
### mount
```bash
mount
Provides access to an entire filesystem in one directory.

- Show all mounted filesystems
mount

- Mount a device
mount -t filesystem_type path_to_device_file directory_to_mount_to

- Mount a CD-ROM device (with the filetype ISO9660) to /cdrom (readonly)
mount -t iso9660 -o ro /dev/cdrom /cdrom

- Mount all the filesystem defined in /etc/fstab
mount -a

- Mount a specific filesystem described in /etc/fstab (e.g. "/dev/sda1 /my_drive ext2 defaults 0 2")
mount /my_drive
```
### mv
```bash
mv
Move or rename files and directories

- Move files in abitrary locations
mv source target

- Do not prompt for confirmation before overwriting existing files
mv -f source target

- Do not prompt for confirmation before overwriting existing files but write to standard error before overriding
mv -fi source target

- Move files in verbose mode, showing files after they are moved
mv -v source target
```
### mysql
```bash
mysql
the MySQL command-line tool

- Connect to a database
mysql database_name

- Connect to a database using credentials
mysql -u user -ppassword database_name

- Execute SQL statements in a script file (batch file)
mysql database_name < script.sql
```
### nc
```bash
nc
reads and writes tcp or udp data

- listen on a specified port
nc  -l port

- connect to a certain port (you can then write to this port)
nc ip_address port

- set a timeout
nc -w timeout_in_seconds ipaddress port

- serve a file
cat somefile.txt | nc -l port

- receive a file
nc ip_address port > somefile.txt

- server stay up after client detach
nc -k -l port

- client stay up after EOF
nc -q timeout ip_address
```
### passwd
```bash
passwd
passwd is a tool used to change a user's password.

- Change the password of the current user
passwd new password

- Change the password of the specified user
passwd username new password

- Get the current statuts of the user
passwd -S

- Make the password of the account blank (it will set the named account passwordless)
passwd -d
```
### ping
```bash
ping
send ICMP ECHO_REQUEST packets to network hosts

- Ping host
ping host

- Ping host limiting the number of packages to be send to four
ping -c 4 host

- Ping host, waiting for 0.5 s between each request (default is 1 s)
ping -i 0.5 host

- Ping host without trying to lookup symbolic names for addresses
ping -n host
```
### pip
```bash
pip
Python package manager

- Install a package
pip install package_name

- Install a specific version of a package
pip install package_name==package_version

- Upgrade a package
pip install -U package_name

- Uninstall a package
pip uninstall package_name

- Save installed packages to file
pip freeze > requirements.txt

- Install packages from file
pip install -r requirements.txt
```
### pwd
```bash
pwd
Print name of current/working directory

- Print the current directory
pwd

- Print the current directory, and resolve all symlinks (e.g. show the "physical" path)
pwd -P
```
### rename
```bash
rename
renames multiple files

- Change foo to bar in matching filenames
rename 's/foo/bar/' *.txt

- Convert to lower case
rename -c *.txt

- No action, just show what renames would occur
rename -n 's/foo/bar/' *.txt
```
### rm
```bash
rm
Remove files or directories

- Remove files from arbitrary locations
rm /path/to/file /otherpath/to/file2

- Remove recursively a directory and all it's subdirectories
rm -r /path/to/folder

- Prompt before every removal
rm -i \*
```
### scp
```bash
scp
Copies files between hosts on a network
Works over a secure connection (SSH)

- upload a file, or upload and rename a file
scp /local/file.txt 10.0.0.1:/remote/path/newname.txt

- download a file
scp 10.0.0.1:/remote/path/file.txt /local/folder

- upload or download a directory
scp -r 10.0.0.1:/remote/path /local/folder

- specify username on host
scp /local/file.txt my_user@10.0.0.1:/remote/path

- copy a file from one host to another
scp 10.0.0.1:/remote/path/file.txt 20.0.0.2:/other/remote/path

- download a file with ssh key
scp -i /local/key 10.0.0.1:/remote/path/file.txt /local/folder
```
### screen
```bash
screen
Hold a session open on a remote server. Manage multiple windows with a single SSH connection.

- Start a new screen session
screen

- Start a new named screen session
screen -S name

- Show open screen sessions
screen -ls

- Reattach to an open screen
screen -r screen id

- Detach from inside a screen
ctrl+A D

- Kill a detached screen
screen -X -S screen id quit
```
### sed
```bash
sed
Run replacements based on regular expressions

- replace all occurrences of a string in a file, and print the result
sed 's/find/replace/g' filename

- replace all occurrences of a string in a file, and overwrite the file
contents
sed -i 's/find/replace/g' filename

- replace all occurrences of an extended regular expression in a file
sed -E 's/regex/replace/g' filename

- replace all occurrences of multiple strings in a file
sed -e 's/find/replace/g' -e 's/find/replace/g' filename
```
### shutdown
```bash
shutdown
Shutdown and reboot the system

- Power off (halt) immediately
shutdown -h now

- Reboot immediately
shutdown -r now

- Reboot in 5 minutes
shutdown -r +5 &

- Cancel a pending shutdown/reboot operation
shutdown -c
```
### ssh
```bash
SSH
Secure Shell is a protocol used to securely log onto remote systems.
It can be used for logging or executing commands on a remote server.

- connecting to a remote server
ssh username@remote_host

- connecting to a remote server with a specific identity (private key)
ssh -i /path/to/key_file username@remote_host

- connecting to a remote server with specific port
ssh username@remote_host -p 2222

- run a command on a remote server
ssh remote_host "command -with -flags"

- ssh tunneling: dynamic port forwarding (SOCKS proxy on localhost:9999)
ssh -D 9999 -C username@remote_host

- ssh tunneling: forward a specific port (localhost:9999 to slashdot.org:80)
ssh -L 9999:slashdot.org:80 username@remote_host

- ssh enable agent forward
ssh -A username@remote_host
```
### sshfs
```bash
SSHFS
filesystem client based on ssh

- mounting remote directory
sshfs username@remote_host:remote_directory mountpoint

- unmounting remote directory
fusermount -u mountpoint

- mounting remote directory from server with specific port
sshfs username@remote_host:remote_directory -p 2222

- use compression
sshfs username@remote_host:remote_directory -C
```
### strace
```bash
strace
Troubleshooting tool for tracing system calls

- Start tracing a specific process by its PID
strace -p pid

- Trace a process and filter output by system call
strace -p pid -e system call name

- Count time, calls, and errors for each system call and report a summary on program exit.
strace -p pid -c
```
### sudo
```bash
sudo
execute a command as another user

- Listing of an unreadable directory:
sudo ls /usr/local/scrt

- To edit a file as user www:
sudo -u www vi /var/www/index.html

- To shutdown the machine:
sudo shutdown -r +10 "Cya soon!"

- To repeat the last command as sudo
sudo !!
```
### svn
```bash
svn
Subversion command line client tool

- Check out a working copy from a repository
svn co url/to/repository

- Bring changes from the repository into the working copy
svn up

- Put files and directories under version control, scheduling them for addition to repository. They will be added in next commit.
svn add PATH...

- Send changes from your working copy to the repository
svn ci -m commit log message [PATH...]

- Show detailed help
svn help
```
### tail
```bash
tail
Display the last part of a file

- show last 'num' lines in file
tail -n num file

- show all file since line 'num'
tail -n +num file

- show last 'num' bytes in file
tail -c num file

- keep reading file until ctrl-c
tail -f file
```
### tar
```bash
tar
Archiving utility
Optional compression with gzip / bzip

- create an archive from files
tar cf target.tar file1 file2 file3

- create a gzipped archive
tar czf target.tar.gz file1 file2 file3

- extract an archive in a target folder
tar xf source.tar -C folder

- extract a gzipped archive in the current directory
tar xzf source.tar.gz

- extract a bzipped archive in the current directory
tar xjf source.tar.bz2

- create a compressed archive, using archive suffix to determine the compression program
tar caf target.tar.xz file1 file2 file3

- list the contents of a tar file
tar tvf source.tar
```
### tcpdump
```bash
tcpdump
Dump traffic on a network

- capture the traffic of a specific interface
tcpdump -i eth0

- capture all TCP traffic showing contents (ASCII) in console
tcpdump -A tcp

- capture the traffic from or to a host
tcpdump host www.example.com

- capture the traffic from a specific interface, source, destination and port
tcpdump -i eth0 src 192.168.1.1 dest 192.168.1.2 and port 80

- capture the traffic of a network
tcpdump net 192.168.1.0/24

- capture all traffic except traffic over port 22 and save to a dump file
tcpdump -w dumpfile.pcap not port 22
```
### telnet
```bash
telnet
telnet is used to connect to a specified port of a host

- telnet to a certain port
telnet  ip_address port

- to exit a telnet session
quit

- default escape character
CTRL + ]

- specify an escape character (x is the escape character)
telnet -e x ip_address port
```
### top
```bash
top
Display dynamic real-time information about running processes.

- Start top
top

- Start top ignoring any idle or zombie processes
top -i

- Start top displaying only processes owned by given user
top -u user-name

- Get help about interactive commands
?
```
### touch
```bash
touch
Change a file access and modification times (atime, mtime)

- Create a new empty file(s) or change the times for existing file(s) to current time.`
touch filename

- Set the times on a file to match those on second file
touch -r filename2 filename
```
### tree
```bash
tree
Show the contents of the current directory as a tree.

- Show files and directories with a depth of 'num'
tree -L num

- Show directories only
tree -d

- Show hidden files too
tree -a

- Print human readable size of files
tree -h

- Print the full path for each file
tree -f

- Print the tree without lines and indentation. Useful when used with -f
tree -i
```
### umount
```bash
umount
Revokes access to an entire filesystem mounted to a directory.
A filesystem cannot be unmounted when it is busy.

- Unmount a filesystem
umount path_to_device_file

- OR
umount path_to_mounted_directory

- Unmount all mounted filesystems (dangerous!)
umount -a
```
### uname
```bash
uname
Print details about the current machine and the operating system running on it.
Note: If you're on Linux, try also the lsb_release command.

- Print hardware-related information: machine and processor
uname -mp

- Print software-related information: operating system, release number, and version
uname -srv

- Print the nodename (hostname) of the system
uname -n

- Print all available system information (hardware, software, nodename)
uname -a
```
### unzip
```bash
unzip
Extract compressed files in a ZIP archive

- extract zip file(s) (for multiple files, seperate file paths by spaces)
unzip file(s)

- extract zip files(s) to given path
unzip files(s) -d /path/to/put/extracted/files

- list the contents of a zip file without extracting
unzip -l file
```
### wget
```bash
wget
Download files from the Web
Supports HTTP, HTTPS, and FTP

- Download a URL to a file
wget -O filename "url"

- Limit download speed
wget --limit-rate=200k url

- Continue an incomplete download
wget -c url

- Download a full website
wget --mirror -p --convert-links -P target_folder url

- FTP download with username and password
wget --ftp-user=username --ftp-password=password url
```
### xargs
```bash
xargs
execute a command with piped arguments

- main use
arguments | xargs command

- handling whitespace in arguments
arguments_null_terminated | xargs -0 command

- example: list unneeded packages with deborphan and remove them with apt-get
sudo deborphan | xargs sudo apt-get remove
```
### zip
```bash
zip
Package and compress (archive) files into zip file

- package and compress multiple directories and files
zip -r compressed.zip /path/to/dir1 /path/to/dir2 /path/to/file

- add files to an existing zip file
zip compressed.zip path/to/file

- remove unwanted files from an existing zip file
zip -d compressed.zip "foo/*.tmp"
```
