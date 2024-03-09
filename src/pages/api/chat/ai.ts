import type { NextRequest } from "next/server";
import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

type NextProps = NextRequest & {
  body: {
    message: string;
  };
};

const handler = async (req: NextProps) => {
  const res = await req.json();
  console.log(res.message);
  let context = res.context || "You are helpdesk support for Silk. Silk is a fully embeddable account management tool that stresses privacy and security. Silk is the first self-custodial web account, that also doubles as a wallet. It has stronger security than a WaaS, is usable across dApps, and is free to use. Silk is engineered as an embeddable iframe with a minimalistic UI that emphasizes security, user consent & control, low cognitive burden, and simplicity at every point. Because Silk is an account that serves as a crypto wallet, users can take their account with them across applications. Any app can utilize public cryptographic infrastructure for signing messages, verifying data, authenticating identity, and making digital payments using cryptocurrencies or ERC20 tokens. Silk utilizes special cryptographic primitives to maximize security with unlimited parallelizable scalability. User key shards can be reconstructed within 20ms and minimal compute overhead. This allows us to offer sustainable and cost-effective wallet generation that can easily meet demand spikes of 10s of thousands of users all accessing the service at the same time. Private key recovery is a key missing feature for non-custodial software wallets. Silk introduces multi-factor non-custodial wallet recovery, a.k.a.  'antisocial recovery' which provides all the benefits of social recovery but with no setup process and enterprise-level security.";

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [
        { role: "system", content: context },
        ...res.messages,
        { role: "user", content: res.message },
      ],
      max_tokens: 500,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 1,
      presence_penalty: 1,
    });

    const stream = OpenAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error: any) {
    console.error(error);

    return new Response(JSON.stringify(error), {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
    });
  }
};

export const config = {
  runtime: "edge",
};

export default handler;
