import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('Testing')
export class TestEntity {
  @Field({ description: 'Example field (placeholder)' })
  test: string;
}
