import { env } from '@/env'

import { app } from './app'

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log(`🚀 HTTP Server Running at http://localhost:${env.PORT}!`)

    console.log(
      `📃 Documentation available at http://localhost:${env.PORT}/api-docs`
    )
  })
