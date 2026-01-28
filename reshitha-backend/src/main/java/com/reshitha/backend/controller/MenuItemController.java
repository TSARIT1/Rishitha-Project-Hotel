package com.reshitha.backend.controller;

import com.reshitha.backend.dto.ApiResponse;
import com.reshitha.backend.model.MenuItem;
import com.reshitha.backend.service.MenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuItemController {

    private final MenuItemService menuItemService;

    @Autowired
    public MenuItemController(MenuItemService menuItemService) {
        this.menuItemService = menuItemService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MenuItem>>> getAllMenuItems() {
        List<MenuItem> items = menuItemService.getAllMenuItems();
        return ResponseEntity.ok(new ApiResponse<>(true, "fetched menu items", items));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MenuItem>> addMenuItem(@RequestBody MenuItem menuItem) {
        MenuItem newItem = menuItemService.addMenuItem(menuItem);
        return ResponseEntity.ok(new ApiResponse<>(true, "Menu item added successfully", newItem));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItem>> updateMenuItem(@PathVariable Long id, @RequestBody MenuItem menuItem) {
        MenuItem updatedItem = menuItemService.updateMenuItem(id, menuItem);
        return ResponseEntity.ok(new ApiResponse<>(true, "Menu item updated successfully", updatedItem));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMenuItem(@PathVariable Long id) {
        menuItemService.deleteMenuItem(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Menu item deleted successfully"));
    }
}
