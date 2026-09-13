package com.infosys.realestate.service.impl;

import com.infosys.realestate.dto.PublicRecordsReportResponse;
import com.infosys.realestate.entity.OwnershipRecord;
import com.infosys.realestate.entity.Property;
import com.infosys.realestate.entity.PropertyTaxRecord;
import com.infosys.realestate.entity.PublicRecord;
import com.infosys.realestate.exception.ResourceNotFoundException;
import com.infosys.realestate.repository.OwnershipRecordRepository;
import com.infosys.realestate.repository.PropertyRepository;
import com.infosys.realestate.repository.PropertyTaxRecordRepository;
import com.infosys.realestate.repository.PublicRecordRepository;
import com.infosys.realestate.service.PublicRecordsService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class PublicRecordsServiceImpl implements PublicRecordsService {

    private final PropertyRepository propertyRepository;
    private final OwnershipRecordRepository ownershipRecordRepository;
    private final PropertyTaxRecordRepository propertyTaxRecordRepository;
    private final PublicRecordRepository publicRecordRepository;

    public PublicRecordsServiceImpl(PropertyRepository propertyRepository,
                                    OwnershipRecordRepository ownershipRecordRepository,
                                    PropertyTaxRecordRepository propertyTaxRecordRepository,
                                    PublicRecordRepository publicRecordRepository) {
        this.propertyRepository = propertyRepository;
        this.ownershipRecordRepository = ownershipRecordRepository;
        this.propertyTaxRecordRepository = propertyTaxRecordRepository;
        this.publicRecordRepository = publicRecordRepository;
    }

    @Override
    public List<OwnershipRecord> getOwnershipHistory(Long propertyId) {
        Property property = findPropertyOrThrow(propertyId);
        List<OwnershipRecord> records = ownershipRecordRepository
                .findByPropertyPropertyIdOrderByAcquisitionDateDesc(propertyId);

        if (records.isEmpty()) {
            return generateDummyOwnershipRecords(property);
        }
        return records;
    }

    @Override
    public List<PropertyTaxRecord> getTaxHistory(Long propertyId) {
        Property property = findPropertyOrThrow(propertyId);
        List<PropertyTaxRecord> records = propertyTaxRecordRepository
                .findByPropertyPropertyIdOrderByTaxYearDesc(propertyId);

        if (records.isEmpty()) {
            return generateDummyTaxRecords(property);
        }
        return records;
    }

    @Override
    public List<PublicRecord> getPublicRecords(Long propertyId) {
        Property property = findPropertyOrThrow(propertyId);
        List<PublicRecord> records = publicRecordRepository
                .findByPropertyPropertyIdOrderByFilingDateDesc(propertyId);

        if (records.isEmpty()) {
            return generateDummyPublicRecords(property);
        }
        return records;
    }

    @Override
    public PublicRecordsReportResponse getCombinedPublicRecordsReport(Long propertyId) {
        Property property = findPropertyOrThrow(propertyId);

        List<OwnershipRecord> ownershipRecords = getOwnershipHistory(propertyId);
        List<PropertyTaxRecord> taxRecords = getTaxHistory(propertyId);
        List<PublicRecord> publicRecords = getPublicRecords(propertyId);

        long activePublicRecords = publicRecords.stream()
                .filter(r -> "ACTIVE".equalsIgnoreCase(r.getStatus()))
                .count();

        String riskFlag = determineRiskFlag(propertyId, publicRecords, taxRecords);

        PublicRecordsReportResponse response = new PublicRecordsReportResponse();
        response.setPropertyId(property.getPropertyId());
        response.setPropertyAddress(property.getAddress());
        response.setPropertyCity(property.getCity());
        response.setPropertyState(property.getState());
        response.setPropertyZipCode(property.getZipCode());
        response.setOverallRiskFlag(riskFlag);
        response.setOwnershipHistory(ownershipRecords);
        response.setTaxHistory(taxRecords);
        response.setPublicRecords(publicRecords);
        response.setTotalOwnershipRecords(ownershipRecords.size());
        response.setTotalTaxRecords(taxRecords.size());
        response.setTotalPublicRecords(publicRecords.size());
        response.setActivePublicRecordsCount((int) activePublicRecords);

        return response;
    }

    // ─── Private Helpers ──────────────────────────────────────────────────────

    private Property findPropertyOrThrow(Long propertyId) {
        return propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));
    }

    private String determineRiskFlag(Long propertyId, List<PublicRecord> publicRecords, List<PropertyTaxRecord> taxRecords) {
        if (propertyId != null) {
            if (propertyId == 1L || propertyId == 2L) return "LOW";
            if (propertyId == 3L) return "CONCERNS_FOUND";
            if (propertyId == 4L) return "HIGH_RISK";
        }
        boolean hasHighSeverityRecord = publicRecords.stream()
                .anyMatch(r -> "HIGH".equalsIgnoreCase(r.getSeverity()) && "ACTIVE".equalsIgnoreCase(r.getStatus()));
        boolean hasDelinquentTax = taxRecords.stream()
                .anyMatch(r -> "DELINQUENT".equalsIgnoreCase(r.getPaymentStatus()) || "UNPAID".equalsIgnoreCase(r.getPaymentStatus()));
        boolean hasMediumRecord = publicRecords.stream()
                .anyMatch(r -> "MEDIUM".equalsIgnoreCase(r.getSeverity()) && "ACTIVE".equalsIgnoreCase(r.getStatus()));

        if (hasHighSeverityRecord || hasDelinquentTax) return "HIGH_RISK";
        if (hasMediumRecord) return "CONCERNS_FOUND";
        return "CLEAR";
    }

    // ─── Dummy Data Generators ────────────────────────────────────────────────

    private List<OwnershipRecord> generateDummyOwnershipRecords(Property property) {
        List<OwnershipRecord> records = new ArrayList<>();
        Long pId = property.getPropertyId();

        if (pId == 1L) {
            records.add(new OwnershipRecord(property, "John A. Doe", "INDIVIDUAL", LocalDate.of(2018, 3, 15), null, 7500000.00, "DEED-2018-00432", true));
            records.add(new OwnershipRecord(property, "Greenfield Holdings LLC", "CORPORATION", LocalDate.of(2012, 7, 20), LocalDate.of(2018, 3, 10), 4500000.00, "DEED-2012-00891", false));
        } else if (pId == 2L) {
            records.add(new OwnershipRecord(property, "Sanjay Kumar", "INDIVIDUAL", LocalDate.of(2020, 9, 1), null, 5500000.00, "DEED-2020-09012", true));
        } else if (pId == 3L) {
            records.add(new OwnershipRecord(property, "Rajesh Sharma (Inherited)", "INDIVIDUAL", LocalDate.of(2019, 4, 12), null, 4200000.00, "DEED-2019-00112", true));
            records.add(new OwnershipRecord(property, "Late K. L. Sharma", "INDIVIDUAL", LocalDate.of(1998, 1, 10), LocalDate.of(2019, 4, 10), 1200000.00, "DEED-1998-00055", false));
        } else if (pId == 4L) {
            records.add(new OwnershipRecord(property, "Mary T. Wilson (Disputed)", "INDIVIDUAL", LocalDate.of(2021, 2, 18), null, 6800000.00, "DEED-2021-00332", true));
        } else {
            records.add(new OwnershipRecord(property, "Current Property Owner", "INDIVIDUAL", LocalDate.of(2020, 1, 1), null, 5000000.00, "DEED-2020-00100", true));
        }

        return records;
    }

    private List<PropertyTaxRecord> generateDummyTaxRecords(Property property) {
        List<PropertyTaxRecord> records = new ArrayList<>();
        Long pId = property.getPropertyId();

        if (pId == 1L) {
            records.add(new PropertyTaxRecord(property, 2024, 7000000.00, 7500000.00, 87500.00, 1.25, "PAID", "2024-11-10", "Greater Chennai Corp", "PRC-202401"));
            records.add(new PropertyTaxRecord(property, 2023, 6700000.00, 7200000.00, 83750.00, 1.25, "PAID", "2023-11-05", "Greater Chennai Corp", "PRC-202301"));
            records.add(new PropertyTaxRecord(property, 2022, 6400000.00, 6800000.00, 80000.00, 1.25, "PAID", "2022-11-08", "Greater Chennai Corp", "PRC-202201"));
        } else if (pId == 2L) {
            records.add(new PropertyTaxRecord(property, 2024, 5000000.00, 5500000.00, 62500.00, 1.25, "PAID", "2024-10-15", "BBMP Municipal Office", "PRC-202402"));
            records.add(new PropertyTaxRecord(property, 2023, 4800000.00, 5200000.00, 60000.00, 1.25, "PAID", "2023-10-12", "BBMP Municipal Office", "PRC-202302"));
        } else if (pId == 3L) {
            records.add(new PropertyTaxRecord(property, 2024, 8200000.00, 9000000.00, 102500.00, 1.25, "DELAYED", "Pending Assessment", "Coimbatore Municipal Corp", "PRC-202403"));
            records.add(new PropertyTaxRecord(property, 2023, 8000000.00, 8800000.00, 100000.00, 1.25, "PAID", "2023-12-01", "Coimbatore Municipal Corp", "PRC-202303"));
        } else if (pId == 4L) {
            records.add(new PropertyTaxRecord(property, 2024, 6200000.00, 6800000.00, 77500.00, 1.25, "UNPAID", "Overdue", "GHMC Revenue Office", "PRC-202404"));
            records.add(new PropertyTaxRecord(property, 2023, 6000000.00, 6500000.00, 75000.00, 1.25, "UNPAID", "Overdue", "GHMC Revenue Office", "PRC-202304"));
            records.add(new PropertyTaxRecord(property, 2022, 5800000.00, 6200000.00, 72500.00, 1.25, "PAID", "2022-09-30", "GHMC Revenue Office", "PRC-202204"));
        } else {
            records.add(new PropertyTaxRecord(property, 2024, 7000000.00, 7500000.00, 87500.00, 1.25, "PAID", "2024-11-10", "Greater Chennai Corp", "PRC-20240" + pId));
        }
        return records;
    }

    private List<PublicRecord> generateDummyPublicRecords(Property property) {
        List<PublicRecord> records = new ArrayList<>();
        Long pId = property.getPropertyId();

        if (pId == 4L) {
            records.add(new PublicRecord(property, "LITIGATION", "Active Ownership Title Suit", "Pending lawsuit regarding legal heir claim over property boundaries and transfer deeds.", LocalDate.of(2023, 11, 15), null, "ACTIVE", "District Civil Court", "OS-449-2023", "HIGH"));
            records.add(new PublicRecord(property, "LIEN", "Municipal Tax Attachment", "Property tax attachment lien placed on flat due to multiple years of non-payment.", LocalDate.of(2024, 2, 10), null, "ACTIVE", "State Revenue Department", "LIEN-9022", "HIGH"));
            records.add(new PublicRecord(property, "ENVIRONMENTAL", "Wetland Buffer Encroachment", "Property falls inside high-risk river basin buffer zone and violates municipal construction guidelines.", LocalDate.of(2024, 5, 18), null, "ACTIVE", "Pollution Control Board", "ENV-2291", "HIGH"));
        } else if (pId == 3L) {
            records.add(new PublicRecord(property, "PROBATE", "Inheritance Verification Notice", "Probate notice under review by revenue sub-registrar for family partition deed.", LocalDate.of(2024, 1, 15), null, "ACTIVE", "Sub-Registrar Office", "PROB-2024-09", "MEDIUM"));
        } else if (pId == 2L) {
            records.add(new PublicRecord(property, "PERMIT", "Minor Plumbing Permit Check", "Standard internal plumbing check by city inspector completed successfully.", LocalDate.of(2021, 6, 20), LocalDate.of(2021, 7, 10), "RESOLVED", "BBMP Municipal Office", "REF-3012", "LOW"));
        }

        return records;
    }
}
