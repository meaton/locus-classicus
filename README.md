# Locus Classicus prototype

#### Demo and API Documentation
* A live demo is available at [locus-classicus.org](http://Locus-classicus.org).
* [API Documentation](http://alf.hum.ku.dk:8002) using [swagger.io UI](http://swagger.io/) (RESTXQ XML database)

## Requirements
* [Meteor](https://github.com/meteor/meteor) v1.2.1
* [eXist-db](https://github.com/eXist-db/exist) v2.2

### Meteor [packages](https://atmospherejs.com/) required

* http
* check
* reactive-var
* iron:router
* aldeed:collection2
* dburles:collection-helpers
* simple:reactive-method
* less
* twbs:bootstrap

## Installation

### eXist-db

1. Module/library requirements
  * JSON Parser and Serializer for XQuery
2. User configuration
  * Administrator user can setup additional users if required
3. Deploy REST service app (RESTXQ)
  * eXist app package can be deployed via the Package Manager
  * ZIP format, containing collection structure/data, XQuery modules and asset files (images, CSS).
4. TEI XML data
  * TEI data can be packaged in the eXist-db app or
  * Uploaded to the deployed app (collection folder) via Collection Browser.
5. Browsing Collection and Re-indexing
  * The apps collection is typically deployed under: /db/apps/{app_name}
  * Toolbar contains functions for re-indexing a collection, uploading or deleting resources (authorisation required).

> Note: In the current app structure and configuration, there is typically a single collection folder used over which the data is indexed and queried. *app_name* is configured in build.xml (eXist-db app package). It is recommended to deploy a package using the Package Manager for successful operation of the REST service (RESTXQ).

### Deployment to alternative server
* Meteor app can be deployed using **meteor deploy <site>** or [Meteor Up](https://github.com/kadirahq/meteor-up).

### Running the app

#### Running Meteor app on port 80
 `ROOT_URL="http://{myDomain}/" meteor --port 80`

#### Web server (proxy)

If running Meteor app on another port other than 80 over HTTP, configure a web server (Apache, nginx) with port forwarding.

#### Example nginx configuration:

```
server {
        listen 80;
        server_name www.locus-classicus.org locus-classicus.org;

        access_log /var/log/nginx/latinreaddemo.access.log;
        error_log /var/log/nginx/latinreaddemo.error.log;

        location / {
                proxy_pass http://127.0.0.1:8000;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header X-Forwarded-For $remote_addr;
        }

}
```

## Contact

Tue Emil Lembcke Søvsø - tues AT hum.ku.dk
Mitchell Seaton - seaton AT hum.ku.dk (developer)

**Locus Classicus** is supported by [CLARIN-DK](http://info.clarin.dk)
