# PTZOptics Node Server

The PTZOptics Node Server is a simple skeleton Express server to control your PTZOptics camera via visca commands.

## Prerequisites

You need to have at least [Node.js version: 8.12.0](https://nodejs.org/en/download/), [MongoDB version: 4.0.3](https://www.mongodb.com/download-center?initial=true#community), and a [PTZOptics camera](https://ptzoptics.com/).

## Installing
1. Configure your PTZOptics camera to your local network. [PTZOptics Knowledge Base](https://help.ptzoptics.com/support/solutions/folders/13000001062)
2. Clone this repo and then extract to your preferred location
3. Update the mongoDB connection information inside `/app/config.json`.  

```
{  
    connectionString: "mongodb://your-mongo-address/db-name",  
    secret: "your db-secret"  
}
```

4. Start the server

    `cd /The/path/to/the/repo`  
    `npm install`  
    `npm start`

5. Head to `http://localhost:4000`
6. Click 'Add Camera' and enter your camera's information.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Authors

[**PTZOptics**](https://github.com/PTZOptics)
