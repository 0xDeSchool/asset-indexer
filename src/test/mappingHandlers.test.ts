import { subqlTest } from "@subql/testing";

/*
// https://academy.subquery.network/build/testing.html
subqlTest(
  "testName", // test name
  1000003, // block height to process
  [], // dependent entities
  [], // expected entities
  "handleEvent" //handler name
);
*/

subqlTest(
  "test create", // test name
  46493070, // block height to process
  [], // dependent entities
  [], // expected entities
  "handleAssetCreatedAssetHubLog" //handler name
);


