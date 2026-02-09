package com.reshitha.backend.service;

import com.reshitha.backend.dto.ReportData;

public interface ReportService {
    ReportData getReportData(int year, int month);
}
