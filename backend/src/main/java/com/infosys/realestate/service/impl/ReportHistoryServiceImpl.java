package com.infosys.realestate.service.impl;

import com.infosys.realestate.dto.ReportHistoryDTO;
import com.infosys.realestate.entity.DueDiligenceReport;
import com.infosys.realestate.entity.Property;
import com.infosys.realestate.entity.ReportHistory;
import com.infosys.realestate.entity.User;
import com.infosys.realestate.repository.ReportHistoryRepository;
import com.infosys.realestate.service.ReportHistoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ReportHistoryServiceImpl implements ReportHistoryService {

    private final ReportHistoryRepository reportHistoryRepository;

    public ReportHistoryServiceImpl(
            ReportHistoryRepository reportHistoryRepository) {
        this.reportHistoryRepository = reportHistoryRepository;
    }

    @Override
    public List<ReportHistoryDTO> getAllReportHistory() {

        return reportHistoryRepository
                .findAllByOrderByGeneratedAtDesc(
                        org.springframework.data.domain.Pageable.unpaged()
                )
                .getContent()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReportHistoryDTO> getReportHistoryByProperty(
            Long propertyId) {

        return reportHistoryRepository
                .findByPropertyPropertyIdOrderByGeneratedAtDesc(propertyId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ReportHistoryDTO getReportHistoryById(Long id) {

        ReportHistory history = reportHistoryRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Report history not found with id: " + id
                        )
                );

        return convertToDTO(history);
    }

    private ReportHistoryDTO convertToDTO(ReportHistory history) {

        ReportHistoryDTO dto = new ReportHistoryDTO();

        // =====================================================
        // HISTORY ID
        // =====================================================

        dto.setId(history.getId());

        // =====================================================
        // REPORT DETAILS
        // =====================================================

        DueDiligenceReport report = history.getReport();

        if (report != null) {

            dto.setReportId(report.getId());

            dto.setStatus(
                    report.getStatus() != null
                            ? report.getStatus()
                            : history.getStatus()
            );

            dto.setReportUrl(report.getReportUrl());

            dto.setCreatedAt(report.getCreatedAt());

            dto.setCompletedAt(report.getCompletedAt());

            dto.setDurationMs(report.getDurationMs());

            dto.setErrorMessage(report.getErrorMessage());

        } else {

            dto.setStatus(history.getStatus());

            dto.setCreatedAt(history.getGeneratedAt());
        }

        // =====================================================
        // PROPERTY DETAILS
        // =====================================================

        Property property = history.getProperty();

        if (property != null) {

            dto.setPropertyId(property.getPropertyId());

            dto.setPropertyName(property.getPropertyName());

            dto.setPropertyAddress(property.getAddress());

            dto.setPropertyCity(property.getCity());

            dto.setPropertyState(property.getState());
        }

        // =====================================================
        // HISTORY DETAILS
        // =====================================================

        dto.setExportFormat(history.getExportFormat());

        dto.setSummary(history.getSummary());

        // Fallback date
        if (dto.getCreatedAt() == null) {
            dto.setCreatedAt(history.getGeneratedAt());
        }

        // =====================================================
        // USER DETAILS
        // =====================================================

        User user = history.getUser();

        if (user != null) {

            dto.setRequestedByName(user.getName());

            dto.setRequestedByEmail(user.getEmail());
        }

        return dto;
    }
}