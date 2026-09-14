package com.infosys.realestate.service.impl;

import com.infosys.realestate.dto.ZoningRequest;
import com.infosys.realestate.dto.ZoningResponse;
import com.infosys.realestate.entity.Property;
import com.infosys.realestate.entity.Zoning;
import com.infosys.realestate.repository.PropertyRepository;
import com.infosys.realestate.repository.ZoningRepository;
import com.infosys.realestate.service.ZoningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ZoningServiceImpl implements ZoningService {

    @Autowired
    private ZoningRepository zoningRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Override
    public ZoningResponse getZoningByPropertyId(Long propertyId) {

        Property property = propertyRepository.findById(propertyId).orElse(null);

        Zoning zoning = zoningRepository
                .findByProperty_PropertyId(propertyId)
                .orElseGet(() -> {
                    Zoning z = new Zoning();
                    z.setProperty(property);
                    String type = (property != null && property.getPropertyType() != null) ? property.getPropertyType() : "Residential";
                    if (type.equalsIgnoreCase("Commercial") || type.equalsIgnoreCase("Flat") || type.equalsIgnoreCase("Apartment")) {
                        z.setZoningCategory("Commercial / Multi-Family");
                        z.setZoningClass("C-2 / R-4 Mixed Density");
                        z.setPlanningAuthority("Metropolitan Development Authority");
                        z.setMasterPlan("Master Plan 2031");
                        z.setParcelIdentifier("PARCEL-COM-" + propertyId);
                        z.setComplianceStatus("COMPLIANT");
                        z.setMaxFar(2.5);
                        z.setMaxHeight("24 meters / 7 floors");
                        z.setGroundCoverage("60%");
                        z.setMinPlotArea("5000 sq.ft");
                        z.setFrontSetback("6 meters");
                        z.setRearSetback("4.5 meters");
                        z.setLeftSetback("3 meters");
                        z.setRightSetback("3 meters");
                        z.setPermittedUsage("Office, Retail, Multi-Family Residential, Commercial");
                        z.setRestrictedUsage("Heavy Manufacturing, Chemical Storage");
                        z.setSpecialRegulations("Standard commercial fire safety and parking ratios apply.");
                    } else {
                        z.setZoningCategory("Residential");
                        z.setZoningClass("R-1 Single Family Residential");
                        z.setPlanningAuthority("Municipal Planning Board");
                        z.setMasterPlan("Master Plan 2031");
                        z.setParcelIdentifier("PARCEL-RES-" + propertyId);
                        z.setComplianceStatus("COMPLIANT");
                        z.setMaxFar(1.8);
                        z.setMaxHeight("15 meters / 3 floors");
                        z.setGroundCoverage("50%");
                        z.setMinPlotArea("2400 sq.ft");
                        z.setFrontSetback("4.5 meters");
                        z.setRearSetback("3 meters");
                        z.setLeftSetback("2.5 meters");
                        z.setRightSetback("2.5 meters");
                        z.setPermittedUsage("Single-Family Dwelling, Villa, Home Office");
                        z.setRestrictedUsage("Heavy Commercial, Industrial Activity");
                        z.setSpecialRegulations("Residential height and setback covenants active.");
                    }
                    return (property != null) ? zoningRepository.save(z) : z;
                });

        return convertToResponse(zoning);
    }

    @Override
    public ZoningResponse createZoning(ZoningRequest request) {

        Property property = propertyRepository
                .findById(request.getPropertyId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Property not found with id: "
                                        + request.getPropertyId()
                        )
                );

        if (zoningRepository
                .findByProperty_PropertyId(request.getPropertyId())
                .isPresent()) {

            throw new RuntimeException(
                    "Zoning information already exists for property id: "
                            + request.getPropertyId()
            );
        }

        Zoning zoning = new Zoning();

        zoning.setProperty(property);

        zoning.setZoningCategory(request.getZoningCategory());
        zoning.setZoningClass(request.getZoningClass());
        zoning.setPlanningAuthority(request.getPlanningAuthority());
        zoning.setMasterPlan(request.getMasterPlan());
        zoning.setParcelIdentifier(request.getParcelIdentifier());
        zoning.setComplianceStatus(request.getComplianceStatus());

        zoning.setMaxFar(request.getMaxFar());
        zoning.setMaxHeight(request.getMaxHeight());
        zoning.setGroundCoverage(request.getGroundCoverage());
        zoning.setMinPlotArea(request.getMinPlotArea());

        zoning.setFrontSetback(request.getFrontSetback());
        zoning.setRearSetback(request.getRearSetback());
        zoning.setLeftSetback(request.getLeftSetback());
        zoning.setRightSetback(request.getRightSetback());

        zoning.setPermittedUsage(request.getPermittedUsage());
        zoning.setRestrictedUsage(request.getRestrictedUsage());
        zoning.setSpecialRegulations(request.getSpecialRegulations());

        Zoning savedZoning = zoningRepository.save(zoning);

        return convertToResponse(savedZoning);
    }

    @Override
    public ZoningResponse updateZoning(
            Long propertyId,
            ZoningRequest request) {

        Zoning zoning = zoningRepository
                .findByProperty_PropertyId(propertyId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Zoning information not found for property id: "
                                        + propertyId
                        )
                );

        zoning.setZoningCategory(request.getZoningCategory());
        zoning.setZoningClass(request.getZoningClass());
        zoning.setPlanningAuthority(request.getPlanningAuthority());
        zoning.setMasterPlan(request.getMasterPlan());
        zoning.setParcelIdentifier(request.getParcelIdentifier());
        zoning.setComplianceStatus(request.getComplianceStatus());

        zoning.setMaxFar(request.getMaxFar());
        zoning.setMaxHeight(request.getMaxHeight());
        zoning.setGroundCoverage(request.getGroundCoverage());
        zoning.setMinPlotArea(request.getMinPlotArea());

        zoning.setFrontSetback(request.getFrontSetback());
        zoning.setRearSetback(request.getRearSetback());
        zoning.setLeftSetback(request.getLeftSetback());
        zoning.setRightSetback(request.getRightSetback());

        zoning.setPermittedUsage(request.getPermittedUsage());
        zoning.setRestrictedUsage(request.getRestrictedUsage());
        zoning.setSpecialRegulations(request.getSpecialRegulations());

        Zoning updatedZoning = zoningRepository.save(zoning);

        return convertToResponse(updatedZoning);
    }

    private ZoningResponse convertToResponse(Zoning zoning) {

        ZoningResponse response = new ZoningResponse();

        response.setZoningId(zoning.getZoningId());

        if (zoning.getProperty() != null) {

            response.setPropertyId(
                    zoning.getProperty().getPropertyId()
            );

            response.setPropertyName(
                    zoning.getProperty().getPropertyName()
            );

            response.setAddress(
                    zoning.getProperty().getAddress()
            );

            response.setCity(
                    zoning.getProperty().getCity()
            );

            response.setState(
                    zoning.getProperty().getState()
            );
        }

        response.setZoningCategory(zoning.getZoningCategory());
        response.setZoningClass(zoning.getZoningClass());
        response.setPlanningAuthority(zoning.getPlanningAuthority());
        response.setMasterPlan(zoning.getMasterPlan());
        response.setParcelIdentifier(zoning.getParcelIdentifier());
        response.setComplianceStatus(zoning.getComplianceStatus());

        response.setMaxFar(zoning.getMaxFar());
        response.setMaxHeight(zoning.getMaxHeight());
        response.setGroundCoverage(zoning.getGroundCoverage());
        response.setMinPlotArea(zoning.getMinPlotArea());

        response.setFrontSetback(zoning.getFrontSetback());
        response.setRearSetback(zoning.getRearSetback());
        response.setLeftSetback(zoning.getLeftSetback());
        response.setRightSetback(zoning.getRightSetback());

        response.setPermittedUsage(zoning.getPermittedUsage());
        response.setRestrictedUsage(zoning.getRestrictedUsage());
        response.setSpecialRegulations(
                zoning.getSpecialRegulations()
        );

        return response;
    }
}
