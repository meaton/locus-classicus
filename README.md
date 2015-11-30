# Locus Classicus prototype

#### Demo and API Documentation
* A live demo is available at [locus-classicus.org](http://Locus-classicus.org).
* [API Documentation](http://alf.hum.ku.dk:8002) using [swagger.io UI](http://swagger.io/) (RESTXQ XML database)

#### Source code
* TODO: github repo/license

## Requirements
* [Meteor](https://github.com/meteor/meteor) (v1.2.1+)
* [eXist-db](https://github.com/eXist-db/exist) (v2.2+)

#### Meteor Packages required:
* [http](https://atmospherejs.com/meteor/http)
* [check](https://atmospherejs.com/meteor/check)
* [reactive-var](https://atmospherejs.com/meteor/reactive-var)
* [iron:router](https://atmospherejs.com/iron/router)
* [aldeed:collection2](https://atmospherejs.com/aldeed/collection2)
* [dburles:collection-helpers](https://atmospherejs.com/dburles/collection-helpers)
* [simple:reactive-method](https://atmospherejs.com/simple/reactive-method)
* [twbs:bootstrap](https://atmospherejs.com/twbs/bootstrap)

## Installation

### eXist-db

1. Module/library requirements
  * JSON Parser and Serializer for XQuery
2. User configuration
  * Administrator user can setup additional users *if required*
3. Deploy REST service app (RESTXQ) as packaged eXist-db app
  * An eXist-db app package can be deployed via the eXist-db Package Manager
  * App package is a ZIP format, containing the collection structure/data (directories), XQuery modules and other asset files (images, CSS).
4. Upload TEI XML data
  * Optionally TEI data can be packaged within the eXist-db app *or*
  * Uploaded to the deployed app (collection folder) via the eXist-db Collection Browser.
5. Browsing Collection and Re-indexing
  * The apps collection is typically deployed under the path: /db/apps/*{app_name}*
  * The toolbar in the Collection Browser contains functions for re-indexing, uploading and deleting resources (Note: authorisation is required to perform these actions).

> Note: In the current app structure and configuration, there is typically a single collection folder that is used, over which the data is indexed and queried. *app_name* is configured in the build.xml file (eXist-db app package). It is recommended to deploy/test an app package using the Package Manager for successful operation of the REST service (RESTXQ).

### Deployment to alternative server (environment)
* The Meteor app can be deployed externally using the meteor cmd **meteor deploy *app_hostname.meteor.com*** for development/testing or using [Meteor Up](https://github.com/kadirahq/meteor-up) to your own hosted server. Hosted deployment options with are also available via [Meteor Galaxy](https://www.meteor.com/why-meteor/pricing).

### Running the app locally

#### Running Meteor app on port 80
 `ROOT_URL="http://{myDomain}/" meteor --port 80`

#### Web server (proxy)

If running the Meteor app over another HTTP port other than 80, configure a web server (Apache, nginx) with port forwarding.

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

## Contact Info

Tue Emil Lembcke Søvsø - Project Lead  
The Saxo Institute
University of Copenhagen  
email: <tues@hum.ku.dk>

Mitchell Seaton - Developer  
Center for Language Technology
Department of Nordic Research  
University of Copenhagen  
email: <seaton@hum.ku.dk>
- - - -
**Locus Classicus** is sponsored by [CLARIN-DK](http://info.clarin.dk)
