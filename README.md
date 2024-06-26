# chatWeb5

Realtime chat using GraphQL Live Queries, Next.js, ComposeDB and Silk.


## Getting Started

1. Install your dependencies:

```bash
npm install
```

2. Generate your admin seed, admin did, and ComposeDB configuration file:

```bash
npm run generate
```

The server configuration that's auto-generated when running this command is inmemory.

3. Create a .env file and enter the three required environment variables outlined in .env.example

(the only environment variable needed for this app is an openai API key)

4. Run the application (make sure you are using node version 20):

#### Development
```bash
nvm use 20
npm run dev
```

#### Build
```bash
npm run build
```

## Built With
- [Ceramic Documentation](https://developers.ceramic.network/learn/welcome/) - Learn more about the Ceramic Ecosystem.
- [ComposeDB](https://composedb.js.org/) - Details on how to use and develop with ComposeDB!
- Silk

## Credit

Credit to [ChatBase](https://github.com/notrab/chatbase) and [Ceremic](https://developers.ceramic.network/learn/welcome/) for awesome templates to work with. 

To learn more, go to the [tutorial](/tutorial.md) page.

