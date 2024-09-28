document.getElementById("removeBackgroundBtn").addEventListener("click", function () {
    const fileInput = document.getElementById("imageInput");
    const files = fileInput.files; // Get all selected files

    if (files.length > 0) {
        const outputDiv = document.getElementById("output");
        outputDiv.innerHTML = ''; // Clear previous results

        const loadingMessage = document.getElementById("loading");
        loadingMessage.style.display = "block";

        const promises = Array.from(files).map(file => {
            const formData = new FormData();
            formData.append("image_file", file);

            // Sending file to Flask backend without API
            return fetch("http://127.0.0.1:5000/remove-background", {
                method: "POST",
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to remove background for ${file.name}`);
                }
                return response.blob();
            })
            .then(blob => {
                const img = document.createElement("img");
                img.src = URL.createObjectURL(blob);

                const downloadBtn = document.createElement("button");
                downloadBtn.textContent = "Download";
                downloadBtn.addEventListener("click", () => {
                    const a = document.createElement("a");
                    a.href = img.src;
                    a.download = file.name;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                });

                const previewBtn = document.createElement("button");
                previewBtn.textContent = "Preview";
                previewBtn.addEventListener("click", () => {
                    const previewWindow = window.open(img.src, '_blank');
                    previewWindow.focus();
                });

                const imgContainer = document.createElement("div");
                imgContainer.style.margin = "10px";
                imgContainer.style.textAlign = "center";
                imgContainer.appendChild(img);
                imgContainer.appendChild(downloadBtn);
                imgContainer.appendChild(previewBtn);

                outputDiv.appendChild(imgContainer);

                return {
                    name: file.name,
                    blob: blob
                };
            });
        });

         Promise.all(promises)
        //     .then(results => {
        //         const zip = new JSZip();
        //         results.forEach(result => {
        //             zip.file(result.name, result.blob);
        //         });

                // const downloadAllBtn = document.getElementById("downloadAllBtn");
                // downloadAllBtn.style.display = "block"; // Show button

                // downloadAllBtn.addEventListener("click", () => {
                //     zip.generateAsync({ type: "blob" })
                //         .then(content => {
                //             const a = document.createElement("a");
                //             a.href = URL.createObjectURL(content);
                //             a.download = "images.zip";
                //             document.body.appendChild(a);
                //             a.click();
                //             document.body.removeChild(a);
                //         });
                //});
            // })
            .catch(error => {
                console.error("Error:", error);
                alert("Failed to remove the background for some images.");
            })
            .finally(() => {
                loadingMessage.style.display = "none";
            });
    } else {
        alert("Please upload at least one image.");
    }
});
