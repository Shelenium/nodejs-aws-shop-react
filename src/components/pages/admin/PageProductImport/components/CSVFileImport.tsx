import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from 'axios';

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const authorization_token: string = localStorage.getItem('authorization_token') || '';

  const uploadFile = async () => {
    console.log("uploadFile to", url);

    const fileName: string = file?.name || '';
    if (!fileName) {
      throw new Error("No file name");
    }

    try {
      const response = await axios({
        method: "GET",
        url,
        params: {
          name: encodeURIComponent(fileName),
        },
        headers: {
          Authorization: authorization_token,
        },
      });
      console.log("File to upload: ", fileName);
      console.log("Uploading to: ", response.data);
      const result = await fetch(response.data, {
        method: "PUT",
        body: file,
      });
      console.log("Result: ", result);
      setFile(undefined);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
