package com.infosys.realestate.service;

import com.infosys.realestate.dto.ReportHistoryDTO;

import java.util.List;

public interface ReportHistoryService {

    List<ReportHistoryDTO> getAllReportHistory();

    List<ReportHistoryDTO> getReportHistoryByProperty(Long propertyId);

    ReportHistoryDTO getReportHistoryById(Long id);
}