# Nest GraphQL code first Serverless Error
`Error: Schema must contain uniquely named types but contains multiple types named "Testing"`

Objective: Run a nest graphql code-first application using serverless, and use ObjectType within another to generate a schema like this
```graphql
type Testing {
    test: String!
}

type User {
    userField: Int!
    test: Testing!
}
```

Steps to reproduce:

* `npm i`
* `npm run build`
* `npx serverless offline --noPrependStageInUrl`
* visit application [http://localhost:3000/graphql](http://localhost:3000/graphql)
* The `src/schema.gql` that is generated looks correct with just one type Testing, but I get the below error in the node console

```
Error: Schema must contain uniquely named types but contains multiple types named "Testing".
    at new GraphQLSchema (/home/myuser/web/test/project-name/node_modules/graphql/type/schema.js:194:15)
    at GraphQLSchemaFactory.create (/home/myuser/web/test/project-name/node_modules/@nestjs/graphql/dist/schema-builder/graphql-schema.factory.js:39:24)
    at GraphQLSchemaBuilder.buildSchema (/home/myuser/web/test/project-name/node_modules/@nestjs/graphql/dist/graphql-schema.builder.js:61:52)
    at GraphQLSchemaBuilder.build (/home/myuser/web/test/project-name/node_modules/@nestjs/graphql/dist/graphql-schema.builder.js:24:31)
    at GraphQLFactory.mergeOptions (/home/myuser/web/test/project-name/node_modules/@nestjs/graphql/dist/graphql.factory.js:33:69)
    at GraphQLModule.onModuleInit (/home/myuser/web/test/project-name/node_modules/@nestjs/graphql/dist/graphql.module.js:92:57)
    at processTicksAndRejections (internal/process/task_queues.js:97:5)
    at async Object.callModuleInitHook (/home/myuser/web/test/project-name/node_modules/@nestjs/core/hooks/on-module-init.hook.js:51:9)
    at async NestApplication.callInitHook (/home/myuser/web/test/project-name/node_modules/@nestjs/core/nest-application-context.js:169:13)
    at async NestApplication.init (/home/myuser/web/test/project-name/node_modules/@nestjs/core/nest-application.js:97:9)
    at async bootstrap (/home/myuser/web/test/project-name/dist/main.js:13:5)
    at async handler (/home/myuser/web/test/project-name/dist/main.js:18:63)
    at async InProcessRunner.run (/home/myuser/web/test/project-name/node_modules/serverless-offline/dist/lambda/handler-runner/in-process-runner/InProcessRunner.js:213:24)
    at async LambdaFunction.runHandler (/home/myuser/web/test/project-name/node_modules/serverless-offline/dist/lambda/LambdaFunction.js:355:20)
    at async hapiHandler (/home/myuser/web/test/project-name/node_modules/serverless-offline/dist/events/http/HttpServer.js:602:18)
    at async exports.Manager.execute (/home/myuser/web/test/project-name/node_modules/@hapi/hapi/lib/toolkit.js:60:28)
    at async Object.internals.handler (/home/myuser/web/test/project-name/node_modules/@hapi/hapi/lib/handler.js:46:20)
    at async exports.execute (/home/myuser/web/test/project-name/node_modules/@hapi/hapi/lib/handler.js:31:20)
    at async Request._lifecycle (/home/myuser/web/test/project-name/node_modules/@hapi/hapi/lib/request.js:372:32)
    at async Request._execute (/home/myuser/web/test/project-name/node_modules/@hapi/hapi/lib/request.js:280:9)
offline: Failure: Schema must contain uniquely named types but contains multiple types named "Testing".
```


## How I set up the project
* `nest new project-name`
* add GraphqlModule to AppModule with minimal settings for code first
* `nest g resource` graphql, code first, generate entry points yes
* Created `src/entities/test.entity.ts` to show how I want to use another object type into the user type
* `npm run start` Everything works as expected at this point, my schema.gql looks good, and the application runs as I expect
* Add serverless following this guide [https://docs.nestjs.com/faq/serverless](https://docs.nestjs.com/faq/serverless)
    * `npm i @vendia/serverless-express aws-lambda`
    * `npm i @types/aws-lambda serverless-offline`
    * Add `serverless.yml` from example
    * Copy `main.ts` from example code into my `src/main.ts` file instead of default
    * Add `"esModuleInterop": true` to `tsconfig.json`
    * `npm run build`
    * `npx serverless offline`
    
    

## Related links
* [https://github.com/nestjs/graphql/issues/1585](https://github.com/nestjs/graphql/issues/1585)
    * Seems to be exact issue, but no resolution. I searched the error in the discord server linked but couldn't find the exact issue (others in the server just deleted dist folder which didn't work for me)
    * @kamilmysliwiec says it is an issue with the project setup. what do I need to change?
* [https://github.com/MichalLytek/type-graphql/issues/396](https://github.com/MichalLytek/type-graphql/issues/396)
    * This issue seems to be the same error, but not of the solutions worked for me. I wonder if using serverless has to do with it?
    * Things I tried
        * In the @ObjectType Decorator, pass in the name of the type (error persists)
        * Delete the dist folder, schema.gql file, rerun build and run (error persists)
        * The file casing doesn't appear to be my issue
        * Some solutions referenced ormconfig.js which I am not using
        * The last 
* [https://stackoverflow.com/questions/68119333/graphql-schema-must-contain-uniquely-named-types-when-using-serverless](https://stackoverflow.com/questions/68119333/graphql-schema-must-contain-uniquely-named-types-when-using-serverless)
    * No solution, but seems like similar issue
    

## Ideas
* Is the issue because I don't directly have a resolver for my Test ObjectType? I don't want to ever resolve this directly
* If I remove the @Field for test from the User ObjectType, and instead in the user resolver add @ResolveField for TestEntity, it works, I just return the @Parent user.test. But what if TestEntity has its own children entities, but I don't want to create a resolver for each ObjectType entity? In my use case, the data comes from a third party api so the resolve field is not what I want, and doing so is not necessary if I am not using serverless so I don't think that is the solution I want
* My schema.gql file is in src, but my built app in dist. However, if that was an issue I would think the app wouldn't work even if I removed the TestEntity reference in the User entity file, but it works if I do that. Also moving the file to dist didn't seem to do anything in my tests other than move where it was generated

My environment
Running node 12.22.1
Nest 8.0.5
