package com.sample.action;

@Controller
@RequestMapping("/admin/")
class SysInsurRepairAgreementAction extends BaseController {

    @RequestMapping(value = "uploadFiles/{id}", method = RequestMethod.POST, headers = "content-type=multipart/form-data")
    public @ResponseBody AttachmentVO uploadFiles(@RequestParam("file") MultipartFile file, @PathVariable("id") Long referId) throws IOException {
        OutputStream fos = null;
        String attachmentURL = null;
        try {
            // 创建文件目录
            /*File uploadFolder = new File(attachmentPath);
            // 如果该文件目录不存在，则创建一个新的目录
            if (!uploadFolder.exists()) {
                uploadFolder.mkdirs();
            }*/
            createDir(attachmentPath);
            File dir = new File(attachmentPath);
            // 文件保存磁盘的完整路径
            attachmentURL = dir + File.separator + realFileName;
            /*uploadFile(fileData, attachmentURL, attachmentVO);*/
            fos = new FileOutputStream(attachmentURL);
            IOUtils.copy(fileData, fos);
            fos.flush();
        } catch (IOException e) {
            LOG.error("文件上传失败", e);
            throw e;
        } finally {
            close(fos, fileData);
        }
    }

    @RequestMapping(value = "downloadFile", method = RequestMethod.POST)
    public void downloadFile(HttpServletResponse response,
                                 HttpServletRequest request, AttachmentVO attachmentVO) throws IOException {
        response.setContentType("application/octet-stream; charset=utf-8");
        response.setHeader("Content-disposition", "attachment; filename=\"" + URLEncoder.encode(attachmentVO.getAttachmentName(), "UTF-8") + "\"");
        response.setHeader("Content-Length", String.valueOf(attachmentVO.getFileSize()));
        OutputStream os = null;
        try {
            os = response.getOutputStream();
            File downloadFile = service.downloadAttachment(attachmentVO);
            /*inputStream = new FileInputStream(downloadFile);*/
            os.write(FileUtils.readFileToByteArray(downloadFile));
            os.flush();
            response.setStatus(HttpServletResponse.SC_OK);
            response.flushBuffer();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            os.close();
        }
    }

    @RequestMapping(value = "deleteFiles", method = RequestMethod.POST)
    public @ResponseBody Map<String, ?> deleteFiles(@RequestBody AttachmentVO[] attachmentVOs) {
        for(SysAgreementAttachmentVO vo : attachmentVOs) {
            File attachmentFile = new File(fileUrl);
            org.apache.commons.io.FileUtils.forceDelete(attachmentFile);
        }
        return SUCCESS;
    }
}