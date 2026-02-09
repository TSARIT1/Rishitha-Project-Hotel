package com.reshitha.backend.dto;

import com.reshitha.backend.model.Customer;
import com.reshitha.backend.model.MenuItem;
import com.reshitha.backend.model.Order;

import java.util.List;

public class GlobalSearchResponse {
    private List<MenuItem> menuItems;
    private List<Customer> customers;
    private List<Order> orders;

    public GlobalSearchResponse() {
    }

    public GlobalSearchResponse(List<MenuItem> menuItems, List<Customer> customers, List<Order> orders) {
        this.menuItems = menuItems;
        this.customers = customers;
        this.orders = orders;
    }

    public List<MenuItem> getMenuItems() {
        return menuItems;
    }

    public void setMenuItems(List<MenuItem> menuItems) {
        this.menuItems = menuItems;
    }

    public List<Customer> getCustomers() {
        return customers;
    }

    public void setCustomers(List<Customer> customers) {
        this.customers = customers;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }
}
