# Metasploit framework via HTTP service
There are metasploit framework running in background by msfrpcd that act like a internal server and msfrpc client running in web interface for using metasploit console.
## Requirement
- Linux operating system
- Nodejs (to run web interface)
## Installation
**Installing Dependencies**

Make sure it is a latest packages on system.
```
sudo apt-get update
sudo apt-get upgrade
```
Install the dependent packages that Metasploit framework need.
```
sudo apt-get install build-essential libreadline-dev libssl-dev libpq5 libpq-dev libreadline5 libsqlite3-dev 
libpcap-dev git-core autoconf postgresql pgadmin3 curl zlib1g-dev libxml2-dev libxslt1-dev vncviewer 
libyaml-dev curl zlib1g-dev
```
**Installing Ruby using RVM**

Because Metasploit coding by Ruby and install with Rubygem.
```
curl -sSL https://rvm.io/mpapis.asc | gpg2 --import -
curl -L https://get.rvm.io | bash -s stable
source ~/.rvm/scripts/rvm
echo "source ~/.rvm/scripts/rvm" >> ~/.bashrc
source ~/.bashrc
RUBYVERSION=$(wget https://raw.githubusercontent.com/rapid7/metasploit-framework/master/.ruby-version -q -O - )
rvm install $RUBYVERSION
rvm use $RUBYVERSION --default
ruby -v
```
**Installing Nmap**

External tools work with Metasploit framework for scanning target.
```
mkdir ~/Development
cd ~/Development
git clone https://github.com/nmap/nmap.git
cd nmap 
./configure
make
sudo make install
make clean
```
**Configuring Postgre SQL Server**

Switch to be postgres user so we can create db for Metasploit framework.
```
sudo -s
su postgres
```
Create user to work with db (the name must as same as in config file). In config file we use **_msfdev_** and 
create db **_msf_dev_db_** owned by **_msfdev_**.
```
createuser msfdev -P -S -R -D
createdb msf_dev_db -O msfdev
exit
exit
```
**Installing Metasploit framework**

We download the latest Metasploit framework via Git.
```
cd /opt
sudo git clone https://github.com/rapid7/metasploit-framework.git
sudo chown -R `whoami` /opt/metasploit-framework
cd metasploit-framework
```
Install using bundler the required gem and versions.
```
cd metasploit-framework

# If using RVM set the default gem set that is create when you navigate in to the folder
rvm --default use ruby-${RUBYVERSION}@metasploit-framework

gem install bundler
bundle install
```
If want to run a command in any user under the Metasploit folder then create a link by this command.
```
cd metasploit-framework
sudo bash -c 'for MSF in $(ls msf*); do ln -s /opt/metasploit-framework/$MSF /usr/local/bin/$MSF;done'
```
Create the databases.yml file that will be contain the configuration parameters used by Metasploit framework.
```
sudo nano /opt/metasploit-framework/config/database.yml
```
Copy the YAML entries and make sure the password that you entered 
```
production:
 adapter: postgresql
 database: msf_dev_db
 username: msfdev
 password: (your password as same as config file)
 host: 127.0.0.1
 port: 5432
 pool: 75
 timeout: 5
```
Create environment variable so it is loaded by msfconsole when running and load the variable in to your currnet shell.
```
sudo sh -c "echo export MSF_DATABASE_CONFIG=/opt/metasploit-framework/config/database.yml >> /etc/profile"

source /etc/profile
```
**RUN!!**

we run the Metasploit to test the system.
```
msfconsole
```
## Usage
**Metasploit framework**

We run Metasploit framework with msfrpcd that metasploit rpc daemon to open service waiting client to connect back.
```
#change directory to Metasploit framework folder and running with root permission
sudo ./msfrpcd -U <username as same as config> -P <password as same as config> -a localhost -f
```
**Metasploit-webapp**

We run web interface with Node.js after your download this repo via Git.
```
node ./bin/www
```
Open web browser and go to http://localhost:3000 then interface will appear.
# THANKS
https://www.darkoperator.com/installing-metasploit-in-ubunt/

