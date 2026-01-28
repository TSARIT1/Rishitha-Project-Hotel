package com.reshitha.backend.service;

import com.reshitha.backend.model.InventoryItem;
import com.reshitha.backend.repository.InventoryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryItemService {

    private final InventoryItemRepository inventoryItemRepository;

    @Autowired
    public InventoryItemService(InventoryItemRepository inventoryItemRepository) {
        this.inventoryItemRepository = inventoryItemRepository;
    }

    public List<InventoryItem> getAllItems() {
        return inventoryItemRepository.findAll();
    }

    public InventoryItem getItemById(Long id) {
        return inventoryItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
    }

    public InventoryItem createItem(InventoryItem item) {
        if (item.getStatus() == null || item.getStatus().isEmpty()) {
            // Simple logic to determine status
            if (item.getCurrentStock() == 0)
                item.setStatus("Out of Stock");
            else if (item.getCurrentStock() < item.getMinLevel())
                item.setStatus("Low Stock");
            else
                item.setStatus("In Stock");
        }
        return inventoryItemRepository.save(item);
    }

    public InventoryItem updateItem(Long id, InventoryItem itemDetails) {
        InventoryItem item = getItemById(id);

        item.setName(itemDetails.getName());
        item.setCategory(itemDetails.getCategory());
        item.setSupplier(itemDetails.getSupplier());
        item.setCurrentStock(itemDetails.getCurrentStock());
        item.setUnit(itemDetails.getUnit());
        item.setUnitCost(itemDetails.getUnitCost());
        item.setMinLevel(itemDetails.getMinLevel());
        item.setMaxLevel(itemDetails.getMaxLevel());
        item.setExpiryDate(itemDetails.getExpiryDate());
        item.setStatus(itemDetails.getStatus());

        return inventoryItemRepository.save(item);
    }

    public void deleteItem(Long id) {
        inventoryItemRepository.deleteById(id);
    }
}
