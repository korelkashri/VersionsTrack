<!--[![Github All Releases](https://img.shields.io/github/downloads/korelkashri/VersionsTrack/total.svg)]()-->

# Versions Track
Web-based application for release versions management.

## Description
Interactive web-based application to control issues & features, alongside development.
Mark and remember old issues with versions/dates/description oriented search.

**Compatible with offline systems.**

## Demo
[demo - VersionsTrack](https://versions-track.herokuapp.com/)

## Dependencies
* [node.js](https://nodejs.org/en/).
* [mongodb](https://www.mongodb.com/).

## Run
```
sudo service mongod start # make sure to start mongodb sevice
node ./app.js
```

### Access Server
```
# On browser [chrome recommanded]: localhost:5000
```

### Base Configuration
At the first application run, the system will automatically create an admin user:
Username: 'admin'
Password: 'admin'
To edit system's users: Login to admin user, in side navigation bar select 'Admin Panel', there you will be able to modify, create, and remove users in/from the system.

## Stabled Features
* Versions basic identifiers: Previous version id, This version id (e.g. From: 3.0.0 To: 3.0.1)
* Version properties: Unique changes that applied in specific version (e.g. Features, Solved Bugs, etc..)
* Easy to use web-based interface, designed with [MaterializeCSS](https://materializecss.com/)
* Versions search by version-id, version release date, and versions/properties descriptions.
* Compatible with offline systems.
* Cross-Platform application.

## Pictures
### Versions Overview
![Version Overview](./docs/images/VersionsTrack-11.png)

### Search section
![Search section](./docs/images/VersionsTrack-12-Search.png)

### Add new version
![Add new version](./docs/images/VersionsTrack-13-NewVersion.png)

### Modify version
![Modify version](./docs/images/VersionsTrack-14-ModifyVersion.png)

### Modify version's property
![Modify version's property](./docs/images/VersionsTrack-15-ModifyProperty.png)

### TODO
* *~~Limit versions count in a page.~~* :heavy_check_mark:
* *~~Limit properties count in a page.~~* :heavy_check_mark:
* Beta version marking.
* Order properties by type/tests scope.
* Add generic description options for versions.
* Properties/Versions short description TAGs.
* *~~Add users privileges.~~* :heavy_check_mark:
* *~~Users privileges:~~* :heavy_check_mark:
    * *~~Admin    -> Full access + Admin panel access.~~* :heavy_check_mark:
    * *~~Manager  -> Create / Delete / Modify versions/properties access.~~* :heavy_check_mark:
    * *~~User     -> Watch access.~~* :heavy_check_mark:
    * *~~Guest    -> Watch access.~~* :heavy_check_mark:
    * *~~Banned   -> No access at all.~~* :heavy_check_mark:
* *~~Add admin panel:~~* :heavy_check_mark:
    * *~~Users control panel~~* :heavy_check_mark:
    
#### Next
* Add discussion page for versions/properties.
* Multiple languages supporting.
* Users privileges:
    * User     -> Comment for issues in versions.
* Admin Panel:
    * Background change option.
* JetBrains/Git integration.