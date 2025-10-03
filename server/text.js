import ImageKit from '@imagekit/nodejs';

const imageKit = new ImageKit({
    publicKey: "test_public_key",
    privateKey: "test_private_key",
    urlEndpoint: "https://ik.imagekit.io/test"
});

console.log("Type of imageKit.upload:", typeof imageKit.upload);