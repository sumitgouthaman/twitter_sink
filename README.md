# Twitter Sink

A very simple NodeJS app to save live tweets about a particular topic to a csv file.  

### Setup Auth
1. Acquire Consumer Key, Consumer Secret, Access Token Key, Access Token Secret from Twitter dev portal ([Instructions](https://dev.twitter.com/oauth/overview/application-owner-access-tokens)).  
1. Set the appropriate values in **twitter_auth_keys.json** file.  

### Install NPM packages
Move to the application folder and run:
```bash
npm install
```

### Run Twitt Sink
Sample usage: 
> npm start -- [Number of topics] [Topic1] [Topic2] .. [TopicN] [Output csv file name]
```bash
npm start -- 3 Microsoft Google Apple tech_companies.csv
```

### Licence
Refer [License.md](./License.md).