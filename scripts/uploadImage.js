const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Replace this with your actual JWT token
const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhMjc5OTQ0ZS1lZTVjLTRiYjktODQzNy1hZDIyZDM1NzU2MDIiLCJlbWFpbCI6ImZseW1hdW50YWluc0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYmY2NjdmNDZhNGJlNDRlNTIxNTIiLCJzY29wZWRLZXlTZWNyZXQiOiJkYTAzOTM1NmM4MjllOTIxNDkwODlkM2M2OTFmOTgwOWM4MGM3MTFjMjdjY2I3ODk2NzFjY2MxOTk0OTQwODQ3IiwiZXhwIjoxNzUzMzIzNDIwfQ.ZnRzcwPOIf9bzOiIAb9Di4YBrl-xSRzhDsdIPW9O3N0';

const pinFileToIPFS = async () => {
    const formData = new FormData();
    const src = path.join(__dirname, '../assets/presale.jfif'); // Use path.join to get the correct file path

    const file = fs.createReadStream(src);
    formData.append('file', file);

    const pinataMetadata = JSON.stringify({
      name: 'Presale Image',
    });
    formData.append('pinataMetadata', pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('pinataOptions', pinataOptions);

    try {
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            maxBodyLength: "Infinity",
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'Authorization': `Bearer ${JWT}`
            }
        });

        // Log the entire response to inspect
        console.log('Response:', res.data);

        // Extract the CID from the response
        const cid = res.data.IpfsHash;
        console.log('CID:', cid);

        // Construct the tokenURI using the CID
        const tokenURI = `https://gateway.pinata.cloud/ipfs/${cid}`;
        console.log('tokenURI:', tokenURI);
    } catch (error) {
        console.error('Error uploading to Pinata:', error);
    }
}

pinFileToIPFS();
