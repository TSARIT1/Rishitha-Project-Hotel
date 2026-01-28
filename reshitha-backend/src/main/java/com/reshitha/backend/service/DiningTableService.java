package com.reshitha.backend.service;

import com.reshitha.backend.model.DiningTable;
import com.reshitha.backend.repository.DiningTableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        return diningTableRepository.save(table);
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
}
