package com.reshitha.backend.service;

import com.reshitha.backend.model.Staff;
import com.reshitha.backend.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StaffService {

    private final StaffRepository staffRepository;

    @Autowired
    public StaffService(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    public Staff getStaffById(Long id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff member not found with id: " + id));
    }

    public Staff createStaff(Staff staff) {
        if (staff.getAttendance() == null)
            staff.setAttendance("0%");
        if (staff.getPerformance() == null)
            staff.setPerformance("average");

        // Custom ID logic can be enhanced here if needed
        return staffRepository.save(staff);
    }

    public Staff updateStaff(Long id, Staff staffDetails) {
        Staff staff = getStaffById(id);

        staff.setName(staffDetails.getName());
        staff.setRole(staffDetails.getRole());
        staff.setStatus(staffDetails.getStatus());
        staff.setShifts(staffDetails.getShifts());
        staff.setSalary(staffDetails.getSalary());
        // update other fields if needed

        return staffRepository.save(staff);
    }

    public void deleteStaff(Long id) {
        staffRepository.deleteById(id);
    }
}
