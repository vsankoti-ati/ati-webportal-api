-- Fix timestamp columns in existing database
-- Run this SQL script in SQL Server Management Studio or Azure Data Studio

USE ati_webportal;
GO

-- Fix document table
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('document') AND name = 'upload_dt')
BEGIN
    ALTER TABLE document DROP COLUMN upload_dt;
    ALTER TABLE document ADD upload_dt datetime NOT NULL DEFAULT GETDATE();
END
GO

-- Verify other timestamp columns are correct
-- If you have other tables with timestamp columns, add similar fixes here

PRINT 'Timestamp columns fixed successfully!';
GO
