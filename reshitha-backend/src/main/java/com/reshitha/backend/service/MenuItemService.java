package com.reshitha.backend.service;

import com.reshitha.backend.model.MenuItem;
import com.reshitha.backend.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MenuItemService {

    private final MenuItemRepository menuItemRepository;

    @Autowired
    public MenuItemService(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    public List<MenuItem> getMenuItemsByCategory(String category) {
        return menuItemRepository.findByCategory(category);
    }

    public Optional<MenuItem> getMenuItemById(Long id) {
        return menuItemRepository.findById(id);
    }

    public MenuItem addMenuItem(MenuItem menuItem) {
        return menuItemRepository.save(menuItem);
    }

    public MenuItem updateMenuItem(Long id, MenuItem updatedItem) {
        return menuItemRepository.findById(id)
                .map(item -> {
                    item.setName(updatedItem.getName());
                    item.setCategory(updatedItem.getCategory());
                    item.setPrice(updatedItem.getPrice());
                    item.setCost(updatedItem.getCost());
                    item.setAvailable(updatedItem.isAvailable());
                    item.setSeasonal(updatedItem.isSeasonal());
                    return menuItemRepository.save(item);
                })
                .orElseThrow(() -> new RuntimeException("Menu Item not found with id " + id));
    }

    public void deleteMenuItem(Long id) {
        menuItemRepository.deleteById(id);
    }
}
