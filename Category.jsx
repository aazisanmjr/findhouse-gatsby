//working for a client 
//that;s how  I write codes
//thanks
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { graphql } from 'gatsby';
import { Flex, Box, Heading, Text } from 'rebass';
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from 'react-html-parser';
import GatsbyLink from 'gatsby-link';
import { StateConsumer } from '../../context/StateContext';
import { Section } from '../../components/Sections';
import Container from 'react-bootstrap/Container';
import ListAccordion from '../../components/Commons/ListAccordion';
import RelatedCarousel from '../../components/Commons/RelatedCarousel';
import RelatedCarouselModal from '../../components/Commons/RelatedCarouselModal';
import ReadMore from '../../components/Commons/ReadMore';
import ConfigureActions from '../../components/Product/ConfigureActions';
import FilterSidebar from '../../components/Product/FilterSidebar';
import SingleProduct from '../../components/Product/SingleProduct';
import CategoriesPageSubcategories from './Subcategory';
import ProductWrapper from '../../components/Product/ProductWrapper';
import Layout from '../../components/Layout';
// import NewsletterSubscribe from '../blocks/NewsletterSubscribe';
import Select from 'react-select';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import {
  nest,
  crossCheckArray,
  createUniqueArrayNumerical,
  minMaxFromArray,
  minFromArray,
  maxFromArray,
} from '../../helpers/ContentHelpers';
import InputRange from 'react-input-range';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Img from 'gatsby-image';
require('react-input-range/lib/css/index.css');
const SliderSettings = {
  infinite: true,
  arrows: false,
  dots: true,
  slidesToShow: 3,
  slidesToScroll: 2,
  slide: `<div class="col-md-4 col-sm-6"></div>`,
  className: 'row banner-slider',
  prevArrow:
    '<button className="slick-prev"><i className="fa fa-angle-left"></i></button>',
  nextArrow:
    '<button className="slick-next"><i className="fa fa-angle-right"></i></button>',
  responsive: [
    {
      breakpoint: 1501,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 1199,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 575,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
};
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const CategoriesPage = ({ data, pageContext }) => {
  const {
    allCategories,
    allBockCatalog,
    allBockBuild,
    allBockProduct,
    bockCatalog,
    sameCategories,
  } = data;
  const { nodeDesc, nodeName, taxonomyId } = bockCatalog;
  const MoreInThisCategory = sameCategories.nodes.filter(
    (v) => v.taxonomyId !== taxonomyId
  );

  const { entityData } = pageContext;

  const productCollection = allBockProduct.nodes;

  //   const { collection, origin } = props.pageContext;
  //   const { name, desc, depth, machine_name, weight, id, image, supporting, products } = props.pageContext.page;
  //
  //   const buildsData = props.pageContext.aData.recent_builds;
  //
  //   const entityData = props.pageContext.aData.entity;
  //
  //   // console.log(props.pageContext)
  //
  const {
    colors: dataColors,
    lens: dataLenses,
    guard: dataGuards,
    fixture: dataFixtures,
  } = entityData.v;
  //
  let children = nest(allCategories.nodes);
  children = children.filter((f) => f.taxonomyId === pageContext.id);
  children = children.length ? children[0].children : [];

  // let productCollection = [];
  // if(products !== null) {
  //   productCollection = products
  // }

  let dataWattage = createUniqueArrayNumerical(
    productCollection,
    'nodePbItems',
    'wattage'
  );
  let dataDiameter = createUniqueArrayNumerical(
    productCollection,
    'nodePbItems',
    'dim_d'
  );
  let dataHeight = createUniqueArrayNumerical(
    productCollection,
    'nodePbItems',
    'dim_h'
  );
  let dataDimming = createUniqueArrayNumerical(
    productCollection,
    'nodePbItems',
    'ld'
  );
  let dataKelvin = createUniqueArrayNumerical(
    productCollection,
    'nodePbItems',
    'lk'
  );

  let anyDimming = false;
  productCollection.map((product, k) => {
    product.nodePbItems.map((item, k) => {
      if (item.ld.length > 0) {
        anyDimming = true;
      }
    });
  });

  if (anyDimming === true) {
    dataDimming = ['Show All', 'Supports Dimming'];
  }

  const classes = useStyles();

  let initFilterState = [
    {
      type: 'wattage',
      value: [],
    },
    {
      type: 'dim_d',
      value: [],
    },
  ];

  if (dataHeight.length) {
    initFilterState.push({
      type: 'dim_h',
      value: [minFromArray(dataHeight), maxFromArray(dataHeight)],
    });
  }
  if (dataDimming.length) {
    initFilterState.push({
      type: 'ld',
      value: [],
    });
  }
  if (dataKelvin.length) {
    initFilterState.push({
      type: 'lk',
      value: [],
    });
  }
  const filterData={
    dataDiameter:dataDiameter,
    dataWattage:dataWattage,
    dataHeight:dataHeight,
    dataKelvin:dataKelvin,
    dataDimming:dataDimming,
  }

  const [productList, setProductList] = useState([...productCollection]);
  // const [sortType, setSortType] = useState('sticky');
  const [filterType, setFilterType] = useState(initFilterState);

  // useEffect(() => {
  //   const sortArray = type => {
  //     const types = {
  //       featured: 'nodeSticky',
  //       atoz: 'nodeName',
  //       ztoa: 'nodeName',
  //     };
  //     const sortProperty = types[type];
  //     // Numerical, default
  //     let sorted = [...productList].sort((a, b) => b[sortProperty] - a[sortProperty]);
  //     // AtoZ
  //     if (type == 'atoz') {
  //       sorted = [...productList].sort((a, b) => a[sortProperty].localeCompare(b[sortProperty]));
  //     }
  //     // ZtoA
  //     if (type == 'ztoa') {
  //       sorted = [...productList].sort((a, b) => b[sortProperty].localeCompare(a[sortProperty]));
  //     }
  //
  //     setProductList(sorted);
  //   };
  //
  //
  //   sortArray(sortType);
  // }, [sortType]);

  let productCount = productCollection.length;

  if (productList !== null) {
    productCount = productList.length;
  }

  const filterStateFunction = (type, valueArray) => {
    if (type == 'dim_h') {
      let manipulateValue = [];
      manipulateValue.push(valueArray.min);
      manipulateValue.push(valueArray.max);

      valueArray = manipulateValue;
    }

    let currentFilters = filterType;

    let newData = [];
    currentFilters.map((filter) => {
      if (filter.type == type) {
        filter.value = valueArray;
      }
      newData.push(filter);
    });

    let actualProducts = productCollection;

    newData.forEach((data, i) => {
      let dataValue = data.value;
      let dataType = data.type;

      if (dataValue !== null && dataValue.length !== 0) {
        if (dataType == 'dim_h') {
          let lower = dataValue[0],
            upper = dataValue[1];
          actualProducts = actualProducts.filter((item) =>
            item.nodePbItems.some((s) => s.dim_h > lower && s.dim_h < upper)
          );
        } else if (dataType == 'ld') {
          if (dataValue == 'Supports Dimming') {
            actualProducts = actualProducts.filter((item) =>
              item.nodePbItems.some((s) => s.ld.length > 0)
            );
          } else {
            actualProducts = actualProducts;
          }
        } else if (dataType == 'lk') {
          actualProducts = actualProducts.filter((p) =>
            p.nodePbItems.some((s) => crossCheckArray(s[dataType], dataValue))
          );
        } else {
          actualProducts = actualProducts.filter((p) =>
            p.nodePbItems.some((s) => dataValue.includes(s[dataType]))
          );
        }
      }
    });

    setProductList(actualProducts);
    setFilterType(newData);
  };

  function onSelect(v, type = null) {
    if (type !== null) {
      filterStateFunction(type, v);
    }
  }

  // let productCollection = [];
  // let children = []
  if (productCollection) {
    return (
      <>
        <Layout>
          <StateConsumer>
            {({
              updateGridListing,
              gridListing,
              updateModal,
              modalType,
              modal,
            }) => {
              return (
                <>
                  <div className="shop-collections-area section pt-75 pt-lg-55 pt-md-55 pt-sm-50 pt-xs-40  pb-100 pb-lg-80 pb-md-70 pb-sm-60 pb-xs-50">
                    <div className="container-fluid container-fluid-minimus pl-lg-15 pl-md-15 pl-sm-15 pl-xs-15 pr-lg-15 pr-md-15 pr-sm-15 pr-xs-15">
                      <div className="row">
                        <div className="col-12">
                          <div className="shop-collection-content">
                            {nodeName && <h2 className="title">{nodeName}</h2>}
                            {nodeDesc && (
                              <ReadMore
                                height="120"
                                color="#fff"
                                title="Read More"
                              >
                                <div style={{ maxWidth: '770px' }}>
                                  {ReactHtmlParser(nodeDesc)}
                                </div>
                              </ReadMore>
                            )}
                          </div>
                        </div>
                      </div>
                      {(() => {
                        if (data.allBockCatalog.edges.length > 0) {
                          return (
                            <CategoriesPageSubcategories
                              items={data.allBockCatalog.edges}
                            />
                          );
                        } else if (productCollection.length > 0) {
                          return (
                            <div className="row row-30">
                              <div className="col-lg-9 order-lg-2 order-1">
                                <ProductWrapper
                                  items={productList}
                                  entityData={entityData}
                                  filterData={filterData}
                                  onSelect={onSelect}
                                  filterType={filterType}
                                />
                                {/*<div className="shop-top-bar shop-top-bar-flex mb-40 mb-xs-20">
                                  <div className="shop-topbar-left">
                                    <p>Showing 1-{productCount} of {productCount}</p>
                                  </div>
                                  <div className="shop-topbar-right shop-tab-flex">
                                  <div className="ccnFancySelectWrapper">
                                    <div className="ccnFancySelectLabel">Sort by: </div>
                                      <select className="ccnFancySelect" onChange={(e) => setSortType(e.target.value)}>
                                        <option value="featured">Featured</option>
                                        <option value="atoz">A to Z</option>
                                        <option value="ztoa">Z to A</option>
                                      </select>
                                    </div>
                                    <div className="shop-tab nav">
                                      <a onClick={v => updateGridListing(1)} className="active">
                                        <i className="fa fa-th"></i>
                                      </a>
                                      <a onClick={v => updateGridListing(0)}>
                                        <i className="fa fa-list"></i>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                                <div className="product-area-wrap">
                                  <div className="row">
                                    {productCollection && productList.map((product, index) => {
                                      let pbData = [];
                                      if(
                                        product.nodePbItems
                                        && product.nodePbItems.length
                                      ){
                                        product.nodePbItems.map((item, i) => {
                                          let itemType = item._b;
                                          let itemKey = item.key;
                                          let itemLink = entityData.v[itemType][itemKey];
                                          if(itemLink){
                                            pbData.push(itemLink);
                                          }
                                        })
                                      }
                                      return (
                                        <SingleProduct item={product} key={index} options={pbData}  />
                                      )
                                    })}
                                </div>
                              </div>*/}
                              </div>
                              <div className="col-lg-3 order-lg-1 order-2">
                                <div className="shop-sidebar">
                                  <div className="sidebar-widget sidebar-border pb-45">
                                    <h4 className="pro-sidebar-title">
                                      Categories{' '}
                                    </h4>
                                    <div className="sidebar-widget-list mt-30">
                                      {console.log(allCategories.nodes)}
                                      <ListAccordion
                                        data={allCategories.nodes}
                                      />
                                    </div>
                                  </div>
                                  {dataDiameter.length > 0 && (
                                    <FilterSidebar title="Diameter">
                                      <Select
                                        isMulti
                                        placeholder="Show all"
                                        captureMenuScroll={false}
                                        menuShouldBlockScroll={false}
                                        menuIsOpen={true}
                                        components={{
                                          DropdownIndicator: () => null,
                                          IndicatorSeparator: () => null,
                                        }}
                                        options={dataDiameter}
                                        getOptionLabel={(option) =>
                                          option + '"'
                                        }
                                        getOptionValue={(option) => option}
                                        onChange={(v) => onSelect(v, 'dim_d')}
                                        className="basic-multi-select basic-multi-select--grid"
                                        classNamePrefix="select"
                                      />
                                    </FilterSidebar>
                                  )}

                                  {dataWattage.length > 1 && (
                                    <FilterSidebar title="Max Wattage">
                                      <Select
                                        isMulti
                                        placeholder="Show all"
                                        captureMenuScroll={false}
                                        menuShouldBlockScroll={false}
                                        menuIsOpen={true}
                                        components={{
                                          DropdownIndicator: () => null,
                                          IndicatorSeparator: () => null,
                                        }}
                                        options={dataWattage}
                                        getOptionLabel={(option) => option}
                                        getOptionValue={(option) => option}
                                        className="basic-multi-select basic-multi-select--grid"
                                        classNamePrefix="select"
                                        onChange={(v) => onSelect(v, 'wattage')}
                                      />
                                    </FilterSidebar>
                                  )}
                                  {dataHeight.length > 0 && (
                                    <FilterSidebar title="Height">
                                      <InputRange
                                        maxValue={maxFromArray(dataHeight)}
                                        minValue={minFromArray(dataHeight)}
                                        value={minMaxFromArray(
                                          filterType[2].value
                                        )}
                                        onChange={(v) => onSelect(v, 'dim_h')}
                                      />
                                    </FilterSidebar>
                                  )}

                                  {dataKelvin.length > 0 && (
                                    <FilterSidebar title="Kelvin Value">
                                      <Select
                                        isMulti
                                        placeholder="Show all"
                                        captureMenuScroll={false}
                                        menuShouldBlockScroll={false}
                                        menuIsOpen={true}
                                        components={{
                                          DropdownIndicator: () => null,
                                          IndicatorSeparator: () => null,
                                        }}
                                        options={dataKelvin}
                                        getOptionLabel={(option) =>
                                          option + 'K'
                                        }
                                        getOptionValue={(option) => option}
                                        className="basic-multi-select basic-multi-select--grid"
                                        classNamePrefix="select"
                                        onChange={(v) => onSelect(v, 'lk')}
                                      />
                                    </FilterSidebar>
                                  )}

                                  {dataDimming.length > 0 && (
                                    <FilterSidebar title="Dimming">
                                      <Select
                                        // isMulti
                                        placeholder="Show all"
                                        captureMenuScroll={false}
                                        menuShouldBlockScroll={false}
                                        menuIsOpen={true}
                                        components={{
                                          DropdownIndicator: () => null,
                                          IndicatorSeparator: () => null,
                                        }}
                                        options={dataDimming}
                                        getOptionLabel={(option) => option}
                                        getOptionValue={(option) => option}
                                        className="basic-multi-select basic-multi-select--list basic-single-select--choice"
                                        classNamePrefix="select"
                                        onChange={(v) => onSelect(v, 'ld')}
                                      />
                                    </FilterSidebar>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                  {/*
              <RelatedCarouselModal
              heading={'Built Recently'}
              items={relatedBuilds}
              itemTitle="part_number"
              itemImage="images"
              onClickModal={{
                modalType: 'three',
                additionalData: entityData
              }}
              imageFromArray
            />
            */}
                  <Section grey title={`More To Explore`}>
                    <Container>
                      {MoreInThisCategory.length ? (
                        <Slider {...SliderSettings}>
                          {MoreInThisCategory &&
                            MoreInThisCategory.map((value, k) => {
                              return (
                                <div>
                                  <div
                                    class="single-banner color-white-two"
                                    style={
                                      {
                                        // height: '355px',
                                        // width: '98%',
                                        // marginRight: '15px',
                                        // marginLeft: '15px',
                                        // marginBottom: '30px',
                                      }
                                    }
                                  >
                                    <div class="banner-img">
                                      <GatsbyLink to={value.pageUrl}>
                                        {value.fileNodeImage && (
                                          <Img
                                            style={{ height: '355px' }}
                                            fluid={
                                              value.fileNodeImage
                                                .childImageSharp.fluid
                                            }
                                            alt={value.nodeName}
                                          />
                                        )}
                                        <span class="title left">
                                          {value.nodeName}
                                        </span>
                                      </GatsbyLink>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </Slider>
                      ) : (
                        <h2>No Products is Viewed</h2>
                      )}
                    </Container>
                  </Section>
                </>
              );
            }}
          </StateConsumer>
        </Layout>
      </>
    );
    //
  }

  return (
    <>
      <CategoriesPageSubcategories items={data.allBockCatalog.edges} />
    </>
  );
};

export const query = graphql`
  query bockCatalog($id: Int, $parent: Int) {
    bockCatalog(taxonomyId: { eq: $id }) {
      nodeName
      nodeDesc
      taxonomyId
      nodeParent
    }
    allCategories: allBockCatalog {
      nodes {
        nodeName
        pageUrl
        taxonomyId
        nodeParent
      }
    }
    sameCategories: allBockCatalog(filter: { nodeParent: { eq: $parent } }) {
      nodes {
        nodeName
        nodeParent
        pageUrl
        taxonomyId
        fileNodeImage {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
    allBockCatalog(filter: { nodeParent: { eq: $id } }) {
      edges {
        node {
          nodeDesc
          nodeName
          nodeParent
          pageUrl
          taxonomyId
          nodeSupporting
          nodeImage
          fileNodeImage {
            childImageSharp {
              fluid {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
    allBockProduct(filter: { nodeCategory: { eq: $id } }) {
      nodes {
        id
        nodeBody
        nodeImages
        nodeName
        pageUrl
        nodeSticky
        nodeType
        nodeEnablePb
        nodePbItems {
          key
          _b
          _c
          _n
          _d
          paint_compatible
          cg_wg_compatible
          cast_guard_compatible
          wattage
          lamp_type_specific
          lens_use
          dim_h
          dim_d
          dim_w
          dim_l
          lamp_types
          ld
          lens
          ls
          lk
          guard
        }
        imageGroup {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
    allBockBuild(limit: 10) {
      nodes {
        nodeId
        part_number
        title
        alias
        imageGroup {
          id
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`;

export default CategoriesPage;
