import axios from 'axios';
import FormData from 'form-data';

export async function uploadFileToIPFS(file) {
  try {
    if (!file) {
      throw new Error('File is not available');
    }

    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    console.log(file);

    let data = new FormData();
    data.append('file', file);

    // const metadata = JSON.stringify({
    //     name: title,
    // });
    // data.append('pinataMetadata', metadata);

    // const pinataOptions = JSON.stringify({
    //     cidVersion: 0,
    //     customPinPolicy: {
    //         regions: [
    //             {
    //                 id: 'FRA1',
    //                 desiredReplicationCount: 1
    //             },
    //             {
    //                 id: 'NYC1',
    //                 desiredReplicationCount: 2
    //             }
    //         ]
    //     }
    // });
    // data.append('pinataOptions', pinataOptions);
    console.log(data);

    return axios
      .post(url, data, {
        headers: {
          'Content-Type': `multipart/form-data;`,
          pinata_api_key: 'bd597739cfd223f55e25', // Replace with your Pinata API key
          pinata_secret_api_key:
            '6294695fbc5a2e5d630ea320b6fc91c000c4aa03f23d48cdd6f350eeb8877f3d',
        },
      })
      .then(function (response) {
        console.log('image uploaded', response.data.IpfsHash);
        return {
          success: true,
          pinataURL: 'https://gateway.pinata.cloud/ipfs/' + response.data.IpfsHash,
        };
      })
      .catch(function (error) {
        console.log(error);
        return {
          success: false,
          message: error.message,
        };
      });
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error.message,
    };
  }
}
