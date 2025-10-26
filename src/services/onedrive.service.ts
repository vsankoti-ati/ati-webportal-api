import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { ClientSecretCredential } from '@azure/identity';
import * as fs from 'fs';

@Injectable()
export class OneDriveService {
  private graphClient: Client;

  constructor(private configService: ConfigService) {
    const credential = new ClientSecretCredential(
      this.configService.get('AZURE_TENANT_ID'),
      this.configService.get('AZURE_CLIENT_ID'),
      this.configService.get('AZURE_CLIENT_SECRET')
    );

    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
      scopes: ['https://graph.microsoft.com/.default']
    });

    this.graphClient = Client.initWithMiddleware({
      authProvider
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<{ webUrl: string }> {
    const folderPath = this.configService.get('ONEDRIVE_HR_FOLDER_PATH');
    
    try {
      // Create a readable stream from the file buffer
      const fileStream = fs.createReadStream(file.path);

      // Upload to OneDrive
      const uploadedFile = await this.graphClient
        .api(`/drive/root:${folderPath}/${file.originalname}:/content`)
        .put(fileStream);

      return {
        webUrl: uploadedFile.webUrl
      };
    } catch (error) {
      console.error('Error uploading file to OneDrive:', error);
      throw error;
    } finally {
      // Clean up the temporary file
      fs.unlink(file.path, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      });
    }
  }

  async deleteFile(webUrl: string): Promise<void> {
    try {
      // Extract file path from webUrl
      const urlParts = webUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const folderPath = this.configService.get('ONEDRIVE_HR_FOLDER_PATH');

      await this.graphClient
        .api(`/drive/root:${folderPath}/${fileName}`)
        .delete();
    } catch (error) {
      console.error('Error deleting file from OneDrive:', error);
      throw error;
    }
  }
}