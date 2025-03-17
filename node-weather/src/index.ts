import { APIGatewayProxyResult } from "aws-lambda";
import { getPayload } from "./cache";

let response: APIGatewayProxyResult;

/**
 * sample signature:
 * exports.lambdaHandler = async (event : APIGatewayProxyEvent , context: APIGatewayEventRequestContext) => { ... }
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * ß
 */
exports.lambdaHandler = async () => {
  try {
    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: await getPayload(),
      }),
    };
  } catch (err) {
    console.log(err);
    return err;
  }

  return response;
};
