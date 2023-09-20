<!-- 地图矢量图形编辑器 -->
<template>
  <div class="content">
    <div class="map" ref="mapContainer"></div>
    <div class="right">
      <div class="layer">
        开启卫星图层：
        <el-switch
          v-model="isOpen"
          inline-prompt
          active-text="是"
          inactive-text="否"
          @change="changeLayer"
        />
      </div>
      <el-input
        v-model="searchKey"
        type="text"
        class="input"
        placeholder="关键字搜索"
        id="input"
      >
        <!-- <template #append>
          <el-button type="text">搜索</el-button>
        </template> -->
      </el-input>

      <div class="pathArray">
        <el-row style="margin-bottom: 20px">
          <el-col :span="4">
            <el-button @click="addPolygon"
              ><el-icon><Plus /></el-icon>新建</el-button
            ></el-col
          >
          <el-col :span="4">
            <el-upload
              ref="uploadRef"
              class="upload-demo"
              :show-file-list="false"
              :auto-upload="false"
              :on-change="fileChange"
            >
              <el-button type="primary"
                ><el-icon><Upload /></el-icon>导入</el-button
              >
            </el-upload></el-col
          >
          <el-col :span="5">
            <el-button @click="download"
              ><el-icon><Download /></el-icon>下载模板</el-button
            ></el-col
          >
          <el-col :span="4">
            <el-button
              type="warning"
              :disabled="pathArray.length == 0"
              @click="exportFile"
              ><el-icon><Download /></el-icon>导出</el-button
            ></el-col
          >
        </el-row>

        <el-tabs
          v-model="active"
          tab-position="left"
          closable
          @tab-remove="removePolygon"
          @tab-change="focus"
        >
          <el-tab-pane
            v-for="item in pathArray"
            :key="item.id"
            :label="item.title"
            :name="item.id"
          >
            <el-form label-position="right" label-width="150px" :model="item">
              <el-form-item label="名称">
                <el-input
                  v-model="item.title"
                  @change="value => updateTitle(value, item.id)"
                />
              </el-form-item>
              <el-form-item label="中心点经度">
                <el-input v-model="item.longitude" disabled>
                  <template #append
                    ><el-button type="info" text @click="copy(item.longitude)"
                      >复制数据</el-button
                    ></template
                  ></el-input
                >
              </el-form-item>
              <el-form-item label="中心点纬度">
                <el-input v-model="item.latitude" disabled>
                  <template #append
                    ><el-button type="info" text @click="copy(item.latitude)"
                      >复制数据</el-button
                    ></template
                  ></el-input
                >
              </el-form-item>
              <el-form-item label="边界数据">
                <el-input v-model="item.border" disabled>
                  <template #append
                    ><el-button type="info" text @click="copy(item.border)"
                      >复制数据</el-button
                    ></template
                  ></el-input
                >
              </el-form-item>
              <!-- <el-form-item>
                <el-button type="primary" @click="">确认修改</el-button>
              </el-form-item> -->
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script setup>
import * as xlsx from "xlsx";
import { readFile } from "@/util/readFile.js";
import { convert_excel_data, export_excel } from "@/util/exportExcel.js";
import AMapLoader from "@amap/amap-jsapi-loader";
import { ref,onMounted } from "vue";

const searchKey = ref("");
const mapContainer = ref(null);
let myMap = null;
let polyEditor = null;
const pathArray = ref([]); //边界数据 id border
let OverlayGroup = [];
let id = 1;
let canRemove = ref(false);
const active = ref(0);
const polygonOption = {
  strokeColor: "#41a3f9",
  strokeOpacity: 0.9,
  strokeWeight: 2,
  fillColor: "#00B2D5",
  fillOpacity: 0.5,
};
window._AMapSecurityConfig = {
  securityJsCode: "5c3b987422852e346152ddbc04c92cac",
};
//计算多边形的中心点
const calculateCenter = function (lnglatarr) {
  var total = lnglatarr.length;
  var X = 0,
    Y = 0,
    Z = 0;
  lnglatarr.forEach(lnglat => {
    var lng = (lnglat[0] * Math.PI) / 180;
    var lat = (lnglat[1] * Math.PI) / 180;
    var x, y, z;
    x = Math.cos(lat) * Math.cos(lng);
    y = Math.cos(lat) * Math.sin(lng);
    z = Math.sin(lat);
    X += x;
    Y += y;
    Z += z;
  });

  X = X / total;
  Y = Y / total;
  Z = Z / total;

  var Lng = Math.atan2(Y, X);
  var Hyp = Math.sqrt(X * X + Y * Y);
  var Lat = Math.atan2(Z, Hyp);

  return [(Lng * 180) / Math.PI, (Lat * 180) / Math.PI];
};
let satellite = null;
const isOpen = ref(false);
const changeLayer = val => {
  console.log(val);
  if (val) {
    myMap.add(satellite);
  } else {
    myMap.remove(satellite);
  }
};
onMounted(() => {
  AMapLoader.load({
    key: "00087fb56ab65b6721d4cdbc8528c727", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.PlaceSearch", "AMap.AutoComplete", "AMap.PolygonEditor"],
  }).then(() => {
    myMap = new AMap.Map(mapContainer.value, {
      zoom: 16,
      center: [120.960633, 31.429383],
      defaultCursor: "pointer",
    });
    satellite = new AMap.TileLayer.Satellite(); //卫星图层
    myMap.on("complete", () => {
      // OverlayGroup = new AMap.OverlayGroup();
      //关键字搜索
      let auto = new AMap.AutoComplete({
        input: "input",
      });
      let placeSearch = new AMap.PlaceSearch({
        autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        map: myMap,
      }); //构造地点查询类
      auto.on("select", e => {
        placeSearch.search(e.poi.name); //关键字查询
      });
      //多边形编辑器
      polyEditor = new AMap.PolygonEditor(myMap, null, {
        createOptions: polygonOption,
      });
      polyEditor.on("add", data => {
        let polygon = data.target;
        let path = [...polygon.getPath()].map(i => {
          return [i.lng, i.lat];
        });

        //设置中心点
        let position = calculateCenter(path);
        let marker = new AMap.Marker({
          position,
          offset: new AMap.Pixel(-10, -10),
          icon: "//vdata.amap.com/icons/b18/1/2.png", // 添加 Icon 图标 URL
          map: myMap,
          extData: { id, type: "marker" },
          draggable: true,
          title: "拖拽试试",
          label: {
            content: "多边形" + id,
            direction: "top",
          },
        });

        //缓存打点的数据
        pathArray.value.push({
          border: JSON.stringify(path),
          id,
          longitude: position[0],
          latitude: position[1],
          title: "多边形" + id,
        });
        active.value = id;
        //点拖拽完成时候
        marker.on("dragend", e => {
          let pos = e.target.getPosition();
          let extData = e.target.getExtData();
          //更新列表对应项的数据
          let index = pathArray.value.findIndex(i => i.id == extData.id);
          if (index >= 0) {
            pathArray.value[index].longitude = pos.lng;
            pathArray.value[index].latitude = pos.lat;
          }
        });
        OverlayGroup.push(marker);

        //设置唯一标识
        polygon.setExtData({ id, type: "polygon" });
        //双击选中
        polygon.on("dblclick", () => {
          polyEditor.close();
          polyEditor.setTarget(polygon);
          polyEditor.open();
          let data = polygon.getExtData();
          active.value = data.id;
        });
        OverlayGroup.push(polygon);
        polyEditor.addAdsorbPolygons(polygon);
        canRemove.value = true;
        id++;
      });
      //调整事件
      polyEditor.on("adjust", data => {
        let polygon = data.target;
        let path = [...polygon.getPath()].map(i => {
          return [i.lng, i.lat];
        });
        let position = calculateCenter(path);
        let extData = polygon.getExtData();
        let index = pathArray.value.findIndex(i => i.id == extData.id);
        if (index >= 0) {
          pathArray.value[index].border = JSON.stringify(path);
          pathArray.value[index].longitude = position[0];
          pathArray.value[index].latitude = position[1];
          //调整中心点
          OverlayGroup.forEach(overlay => {
            let extData2 = overlay.getExtData();
            if (extData2.id == extData.id && extData2.type == "marker") {
              overlay.setPosition(position);
            }
          });
        }
      });
      //新增节点事件
      polyEditor.on("addnode", data => {
        let polygon = data.target;
        let path = [...polygon.getPath()].map(i => {
          return [i.lng, i.lat];
        });
        let position = calculateCenter(path);
        let extData = polygon.getExtData();
        let index = pathArray.value.findIndex(i => i.id == extData.id);
        if (index >= 0) {
          pathArray.value[index].border = JSON.stringify(path);
          pathArray.value[index].longitude = position[0];
          pathArray.value[index].latitude = position[1];
          OverlayGroup.forEach(overlay => {
            let extData2 = overlay.getExtData();
            if (extData2.id == extData.id && extData2.type == "marker") {
              overlay.setPosition(position);
            }
          });
        }
      });
    });
  });
});
//添加矢量图形
const addPolygon = () => {
  canRemove.value = false;
  polyEditor.close();
  polyEditor.setTarget();
  polyEditor.open();
};
//移除矢量图形
const removePolygon = id => {
  OverlayGroup.forEach(function (overlay) {
    let extData = overlay.getExtData();
    if (extData.id == id) {
      myMap.remove(overlay);
    }
  });
  polyEditor.close();
  polyEditor.setTarget();
  pathArray.value = pathArray.value.filter(i => i.id != id);
};
function clickCopy(text) {
  document.addEventListener("copy", evn => {
    evn.clipboardData.setData("text/plain", text);
    evn.preventDefault(); // 阻止默认行为
  }); // 添加一个copy事件
  document.execCommand("copy"); // 执行copy方法
  ElMessage.success("复制成功");
}
//复制
const copy = border => {
  clickCopy(border);
};
//选中
const focus = id => {
  OverlayGroup.forEach(overlay => {
    let extData = overlay.getExtData();
    if (extData.id == id && extData.type == "polygon") {
      polyEditor.close();
      polyEditor.setTarget(overlay);
      polyEditor.open();
    }
  });
};
//复制所有数据
const copyAll = () => {
  let AllBorder = pathArray.value.map(i => JSON.parse(i.border));
  clickCopy(JSON.stringify(AllBorder));
};
//修改名称
const updateTitle = (title, id) => {
  OverlayGroup.forEach(overlay => {
    let extData = overlay.getExtData();
    if (extData.id == id && extData.type == "marker") {
      overlay.setLabel({
        content: title,
        direction: "top",
      });
    }
  });
};
//导入 文件上传
const uploadRef = ref();

const fileChange = async file => {
  // 获取上传excel的文件数据
  let dataBinary = await readFile(file.raw);
  // 获取工作簿对象
  let workBook = xlsx.read(dataBinary, { type: "binary", cellDates: true });
  // 获取第一个工作表的数据
  let workSheet = workBook.Sheets[workBook.SheetNames[0]];
  // 把工作表数据转为json
  const data = xlsx.utils.sheet_to_json(workSheet);
  console.log("data", data);
  let arr = [...data].map(i => {
    let border = i["边界数据（必填）"];
    //没有中心点时候自动生成
    let position;
    if (i["中心点经度"] && i["中心点纬度"]) {
      position = [i["中心点经度"], i["中心点纬度"]];
    } else {
      position = calculateCenter(JSON.parse(border));
    }
    let d = {
      border,
      id,
      longitude: position[0],
      latitude: position[1],
      title: i["名称"] || "多边形" + id,
    };
    let polygon = new AMap.Polygon({
      ...polygonOption,
      path: JSON.parse(d.border),
      extData: {
        id,
        type: "polygon",
      },
    });
    //双击选中
    polygon.on("dblclick", () => {
      polyEditor.close();
      polyEditor.setTarget(polygon);
      polyEditor.open();
      let data = polygon.getExtData();
      active.value = data.id;
    });
    OverlayGroup.push(polygon);
    polyEditor.addAdsorbPolygons(polygon);
    let marker = new AMap.Marker({
      position: [d.longitude, d.latitude],
      offset: new AMap.Pixel(-10, -10),
      icon: "//vdata.amap.com/icons/b18/1/2.png", // 添加 Icon 图标 URL
      extData: { id, type: "marker" },
      draggable: true,
      title: "拖拽试试",
      label: {
        content: d.title,
        direction: "top",
      },
    });
    //点拖拽完成时候
    marker.on("dragend", e => {
      let pos = e.target.getPosition();
      let extData = e.target.getExtData();
      //更新列表对应项的数据
      let index = pathArray.value.findIndex(i => i.id == extData.id);
      if (index >= 0) {
        pathArray.value[index].position = [pos.lng, pos.lat];
      }
    });
    OverlayGroup.push(polygon, marker);
    myMap.add(polygon);
    myMap.add(marker);
    id++;
    return d;
  });
  pathArray.value.push(...arr);
  active.value = arr[0].id;
};
//下载模板
const download = () => {
  window.open("/template/导入模板.xlsx");
};
//导出
const exportFile = () => {
  //导出Excel表格的表头设置
  const jsonFields = {
    title: "名称",
    longitude: "中心点经度",
    latitude: "中心点纬度",
    border: "边界数据（必填）",
  };
  //转换为中文表头
  const excelData = convert_excel_data(pathArray.value, jsonFields);
  // 导出文件 '文件列表.xlsx'
  export_excel(excelData, "边界数据");
};
</script>
<style scoped lang="less">
.content {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  .map {
    flex: 1;
    height: 100%;
  }
  .right {
    width: 600px;
    height: 100%;
    overflow: auto;
    padding: 20px;
    .layer{
      width: 100%;
      margin: 20px auto;
    }
    .pathArray {
      width: 100%;
      margin: 20px auto;
    }
  }
}
</style>
