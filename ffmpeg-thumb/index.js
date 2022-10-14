// Simple, will use promise based system later
function getThumbnailFromVideo (videoPath, homePath) {

    const thumbnailFolder = path.join(homePath, 'thumbnails');
    const thumbnailPath = path.join(homePath, path.basename(videoPath) + '.jpg');
    
    if (!fs.existsSync(thumbnailFolder)) {
        fs.mkdirSync(thumbnailFolder);
    }
    
    if (fs.existsSync(thumbnailPath)) {
        return thumbnailPath;
    } else {
        ffmpeg(videoPath, function (err, video) {
            if (!err) {
                video.fnExtractFrameToJPG(thumbnailFolder, {
                    frame_rate: 1,
                    number: 1,
                    file_name: path.basename(videoPath)
                }, function (error, files) {
                    if (!error) {
                        console.log('Frames: ' + files);
                    }
                });
            } else {
                console.log('Error: ' + err);
            }
        });
    }
    
}
