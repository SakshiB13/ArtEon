const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1ZDMyN2FhMi01NWVlLTQ5ODgtODU1MS1hM2FkY2Y0NWFiMGQiLCJlbWFpbCI6InNha3NoaWJvbGUwMTNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImJkNTk3NzM5Y2ZkMjIzZjU1ZTI1Iiwic2NvcGVkS2V5U2VjcmV0IjoiNjI5NDY5NWZiYzVhMmU1ZDYzMGVhMzIwYjZmYzkxYzAwMGM0YWEwM2YyM2Q0OGNkZDZmMzUwZWViODg3N2YzZCIsImlhdCI6MTcwNzEzMjA4NX0.O-oYY2HCuB86NKvo7zfp-KUYCiMCwFRgScCPvzb99N4'

export const pinFileToIPFS = async (file) => {
    const formData = new FormData();
    const src = file;
    
    const file1 = fs.createReadStream(src)
    formData.append('file', file1)
    
    // const pinataMetadata = JSON.stringify({
    //   name: 'File name',
    // });
    // formData.append('pinataMetadata', pinataMetadata);

    try{
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: "Infinity",
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: JWT
        }
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
}

pinFileToIPFS()