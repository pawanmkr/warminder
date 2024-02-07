import fs from "fs";
import config from "../../configs/config.js";
import {
  BlobServiceClient,
  ContainerClient,
} from "@azure/storage-blob";

const blobServiceClient = BlobServiceClient.fromConnectionString(config.azure.connection_string as string);
const containerClient: ContainerClient = blobServiceClient.getContainerClient(config.azure.container_name as string);

export async function upload_picture(file: any) {
  const exists = await containerClient.exists();
  if (!exists) {
    await containerClient.create();
  }

  const blockBlobClient = containerClient.getBlockBlobClient(file.filename);

  // Check if the blob with the same name already exists
  const blobExists = await blockBlobClient.exists();

  if (!blobExists) {
    // If the blob doesn't exist, proceed with the upload
    await blockBlobClient.uploadData(fs.readFileSync(file.path));
  }

  return blockBlobClient.url;
}
