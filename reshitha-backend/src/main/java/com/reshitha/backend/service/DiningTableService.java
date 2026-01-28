package com.reshitha.backend.service;

import com.reshitha.backend.model.DiningTable;
import com.reshitha.backend.repository.DiningTableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class DiningTableService {

    private final DiningTableRepository diningTableRepository;

    @Autowired
    public DiningTableService(DiningTableRepository diningTableRepository) {
        this.diningTableRepository = diningTableRepository;
    }

    public List<DiningTable> getAllTables() {
        return diningTableRepository.findAll();
    }

    public DiningTable addTable(DiningTable table) {
        if (diningTableRepository.findByTableNo(table.getTableNo()).isPresent()) {
            throw new RuntimeException("Table number already exists");
        }

        try {
            // Generate QR Code
            String qrContent = "https://rishitha.com/menu/" + table.getTableNo();
            String qrCodeImage = generateQRCodeImage(qrContent, 200, 200);
            table.setQrCodeImage(qrCodeImage);
        } catch (Exception e) {
            // Log error but proceed? Or fail? failing safely for now or just printing stack
            // trace
            e.printStackTrace();
        }

        return diningTableRepository.save(table);
    }

    private String generateQRCodeImage(String text, int width, int height) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);

        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        byte[] pngData = pngOutputStream.toByteArray();

        return Base64.getEncoder().encodeToString(pngData);
    }

    public DiningTable updateTable(Long id, DiningTable tableDetails) {
        DiningTable table = diningTableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table not found"));

        table.setCapacity(tableDetails.getCapacity());
        table.setLocation(tableDetails.getLocation());
        table.setWaiter(tableDetails.getWaiter());
        table.setStatus(tableDetails.getStatus());
        // tableNo typically shouldn't change easily to avoid confusion, but can be
        // added if needed

        return diningTableRepository.save(table);
    }

    public void deleteTable(Long id) {
        diningTableRepository.deleteById(id);
    }

    public DiningTable regenerateQRCode(Long id) throws Exception {
        DiningTable table = diningTableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table not found"));

        String qrContent = "https://rishitha.com/menu/" + table.getTableNo();
        String qrCodeImage = generateQRCodeImage(qrContent, 200, 200);
        table.setQrCodeImage(qrCodeImage);

        return diningTableRepository.save(table);
    }
}
