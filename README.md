# Swedish Historic Housing and Forest Coverage Datasets  

This repository provides datasets and accompanying resources for the study of historical housing construction techniques in Sweden (1800–1920) and their relationship with forest coverage. The datasets are available in multiple formats: CSV, GeoJSON, and GeoTIFF, ensuring compatibility with a wide range of tools and applications.  

## Table of Contents  
- [Overview](#overview)  
- [Datasets](#datasets)  
  - [House Data](#house-data)  
  - [Forest Coverage Data](#forest-coverage-data)  
- [File Structure](#file-structure)  
- [Usage Instructions](#usage-instructions)  
- [Dependencies](#dependencies)  
- [Credits](#credits)  

---

## Overview  

The data provided here was collected, cleaned, and processed as part of a research project investigating the impact of forest availability on historical building techniques. The datasets include:  
1. **House Data**: Details of 6,311 houses (construction year, building techniques, location, etc.).  
2. **Forest Coverage**: Historical forest coverage data derived from georeferenced maps.  

---

## Datasets  

### House Data  

- **Description**: Includes 6,311 houses with details like construction year, building techniques, and geographic location.  
- **Formats**:  
  - `CSV`: Tabular format for general-purpose use.  
  - `GeoJSON`: Geospatial format for use in GIS applications.  

| **Name**                  | **Type**   | **Example value**         | **Description**                                             |
|---------------------------|------------|---------------------------|-------------------------------------------------------------|
| **Location**              |            |                           |                                                             |
| Latitude                  | Float      | 59.493942                 | Latitude in WGS 84                                          |
| Longitude                 | Float      | 17.947475                 | Longitude in WGS 84                                         |
| County                    | String     | Skåne                     | Region name                                                 |
| **Date**                  |            |                           |                                                             |
| Year of construction      | Date       | 1820-01-01                | Year of construction in date format.                       |
| **Frame**                 |            |                           |                                                             |
| Frame_wood                | Bool       | FALSE                     | If word "wood" is used in Frame                             |
| Frame_wood_beams          | Bool       | FALSE                     | If "wood beams" or similar is mentioned in Frame           |
| Frame_wood_logs           | Bool       | TRUE                      | If "logs" or similar is mentioned in Frame                 |
| Frame_wood_planks         | Bool       | FALSE                     | If "planks" or similar is mentioned in Frame               |
| Frame_wood_saving         | Bool       | TRUE                      | If wood saving techniques are mentioned in Frame           |
| Frame_concrete            | Bool       | FALSE                     | If "concrete" or similar is mentioned in Frame             |
| Frame_concrete_aerated    | Bool       | FALSE                     | If "aerated concrete" or similar is mentioned in Frame     |
| Frame_stone               | Bool       | TRUE                      | If "stone" or similar is mentioned in Frame                |
| Frame_bricks              | Bool       | FALSE                     | If "bricks" or similar is mentioned in Frame               |
| Frame_bricks_leca         | Bool       | FALSE                     | If "leca" or similar is mentioned in Frame                 |
| Frame_bricks_adobe        | Bool       | TRUE                      | If "adobe" or similar is mentioned in Frame                |
| Frame_steel               | Bool       | FALSE                     | If "steel" or similar is mentioned in Frame                |
| Frame                     | String     | Sannolik lersten med  <br />korsvirke samt gråsten. <br />Annat material kan  <br />förekomma. | Original frame description from property listing.          |

### Forest Coverage Data  

- **Description**: Historical forest coverage in Sweden, categorized by forest type.  
- **Formats**:  
  - `GeoTIFF`: Raster format for precise geospatial analysis.  
  - `GeoJSON`: Vectorized version for integration into GIS tools.  

---

## File Structure  

```plaintext  
├── datasets/  
│   ├── house_data/  
│   │   ├── house_data.csv  
│   │   ├── house_data.geojson  
│   │   └── house_data_metadata.json  
│   ├── forest_coverage/  
│       ├── forest_coverage.tif  
│       ├── forest_coverage.geojson  
│       └── forest_coverage_metadata.json  
├── notebooks/  
│   ├── geospatial_processing.ipynb  
│   ├── data_cleaning.ipynb  
│   └── visualizations.ipynb  
├── scripts/  
│   ├── format_conversion.py  
│   ├── geospatial_processing.py  
│   └── generate_metadata.py  
├── LICENSE  
└── README.md  
