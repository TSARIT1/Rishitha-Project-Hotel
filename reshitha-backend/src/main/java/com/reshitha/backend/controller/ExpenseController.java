package com.reshitha.backend.controller;

import com.reshitha.backend.dto.ApiResponse;
import com.reshitha.backend.model.Expense;
import com.reshitha.backend.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    @Autowired
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Expense>>> getAllExpenses() {
        List<Expense> expenses = expenseService.getAllExpenses();
        return ResponseEntity.ok(new ApiResponse<>(true, "Fetched all expenses", expenses));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Expense>> createExpense(@RequestBody Expense expense) {
        Expense newExpense = expenseService.createExpense(expense);
        return ResponseEntity.ok(new ApiResponse<>(true, "Expense created successfully", newExpense));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Expense deleted successfully"));
    }
}
