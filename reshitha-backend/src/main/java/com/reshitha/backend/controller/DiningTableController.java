package com.reshitha.backend.controller;

import com.reshitha.backend.dto.ApiResponse;
import com.reshitha.backend.model.DiningTable;
import com.reshitha.backend.service.DiningTableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
public class DiningTableController {

    private final DiningTableService diningTableService;

    @Autowired
    public DiningTableController(DiningTableService diningTableService) {
        this.diningTableService = diningTableService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DiningTable>>> getAllTables() {
        List<DiningTable> tables = diningTableService.getAllTables();
        return ResponseEntity.ok(new ApiResponse<>(true, "Fetched all tables", tables));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DiningTable>> addTable(@RequestBody DiningTable table) {
        try {
            DiningTable newTable = diningTableService.addTable(table);
            return ResponseEntity.ok(new ApiResponse<>(true, "Table added successfully", newTable));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DiningTable>> updateTable(@PathVariable Long id, @RequestBody DiningTable table) {
        DiningTable updatedTable = diningTableService.updateTable(id, table);
        return ResponseEntity.ok(new ApiResponse<>(true, "Table updated successfully", updatedTable));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTable(@PathVariable Long id) {
        diningTableService.deleteTable(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Table deleted successfully"));
    }
}
