package com.reshitha.backend.controller;

import com.reshitha.backend.dto.ApiResponse;
import com.reshitha.backend.model.Staff;
import com.reshitha.backend.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    private final StaffService staffService;

    @Autowired
    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Staff>>> getAllStaff() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Fetched all staff", staffService.getAllStaff()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Staff>> createStaff(@RequestBody Staff staff) {
        return ResponseEntity
                .ok(new ApiResponse<>(true, "Staff created successfully", staffService.createStaff(staff)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Staff>> updateStaff(@PathVariable Long id, @RequestBody Staff staff) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Staff updated", staffService.updateStaff(id, staff)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStaff(@PathVariable Long id) {
        staffService.deleteStaff(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Staff deleted", null));
    }
}
