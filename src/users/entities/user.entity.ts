import { ObjectType, Field, Int } from '@nestjs/graphql';
import { TestEntity } from './test.entity';

@ObjectType('User')
export class User {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  userField: number;

  @Field(() => TestEntity, { description: 'Example field (placeholder)' })
  test: TestEntity;
}

console.log(TestEntity);
