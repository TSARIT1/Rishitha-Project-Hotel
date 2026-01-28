package com.reshitha.backend.controller;

import com.reshitha.backend.dto.ApiResponse;
import com.reshitha.backend.model.InventoryItem;
import com.reshitha.backend.service.InventoryItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryItemController {

    private final InventoryItemService inventoryItemService;

    @Autowired
    public InventoryItemController(InventoryItemService inventoryItemService) {
        this.inventoryItemService = inventoryItemService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<InventoryItem>>> getAllItems() {
        return ResponseEntity
                .ok(new ApiResponse<>(true, "Fetched all inventory items", inventoryItemService.getAllItems()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<InventoryItem>> createItem(@RequestBody InventoryItem item) {
        return ResponseEntity
                .ok(new ApiResponse<>(true, "Inventory item created", inventoryItemService.createItem(item)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<InventoryItem>> updateItem(@PathVariable Long id,
            @RequestBody InventoryItem item) {
        return ResponseEntity
                .ok(new ApiResponse<>(true, "Inventory item updated", inventoryItemService.updateItem(id, item)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteItem(@PathVariable Long id) {
        inventoryItemService.deleteItem(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Inventory item deleted", null));
    }
}
