<script setup>
import { RouterLink } from 'vue-router'
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import SignaturePad from 'signature_pad'

const canvasRef0 = ref(null)
const canvasRef1 = ref(null)
const canvasRef2 = ref(null)
const signaturePads = []

/** 類別表單 radio 預設選取（實際抽查情形＝符合、抽查結果＝抽查合格） */
const categoryForm = ref({
  situation_plastic: '符合', result_plastic: '抽查合格',
  situation_concrete: '符合', result_concrete: '抽查合格',
  situation_manhole: '符合', result_manhole: '抽查合格',
  situation_handhole: '符合', result_handhole: '抽查合格',
  situation_plastic_2: '符合', result_plastic_2: '抽查合格',
  situation_concrete_2: '符合', result_concrete_2: '抽查合格',
  situation_manhole_2: '符合', result_manhole_2: '抽查合格',
  situation_handhole_2: '符合', result_handhole_2: '抽查合格',
  situation_plastic_3: '符合', result_plastic_3: '抽查合格',
  situation_concrete_3: '符合', result_concrete_3: '抽查合格',
  situation_manhole_3: '符合', result_manhole_3: '抽查合格',
  situation_handhole_3: '符合', result_handhole_3: '抽查合格'
})
/** 之後可改為 logo 圖片路徑，例如: new URL('../assets/logo.png', import.meta.url).href */
const logoSrc = ref('')
let accordionEl = null
let onAccordionShown = null

onMounted(() => {
  nextTick(() => {
    const canvases = [canvasRef0.value, canvasRef1.value, canvasRef2.value]
    canvases.forEach((canvas, i) => {
      if (canvas) {
        signaturePads[i] = new SignaturePad(canvas, {
          backgroundColor: 'rgb(255, 255, 255)',
          penColor: 'rgb(0, 0, 0)'
        })
      }
    })
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    onAccordionShown = () => nextTick(resizeCanvas)
    accordionEl = document.getElementById('accordionExample')
    if (accordionEl) {
      accordionEl.addEventListener('shown.bs.collapse', onAccordionShown)
    }
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas)
  if (accordionEl && onAccordionShown) {
    accordionEl.removeEventListener('shown.bs.collapse', onAccordionShown)
  }
  signaturePads.forEach(pad => pad && pad.off())
})

function resizeCanvas() {
  const canvases = [canvasRef0.value, canvasRef1.value, canvasRef2.value]
  const ratio = Math.max(window.devicePixelRatio || 1, 1)
  canvases.forEach((canvas, i) => {
    if (!canvas || !signaturePads[i]) return
    const pad = signaturePads[i]
    const hadContent = !pad.isEmpty()
    const data = hadContent ? pad.toDataURL() : null
    const ctx = canvas.getContext('2d')
    const parent = canvas.parentElement
    const w = Math.max(parent?.offsetWidth || 400, 300)
    const h = 160
    canvas.width = w * ratio
    canvas.height = h * ratio
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    ctx.scale(ratio, ratio)
    pad.clear()
    if (data) pad.fromDataURL(data)
  })
}

function clearSignature(index) {
  if (signaturePads[index]) signaturePads[index].clear()
}
</script>

<template>
  <div class="desktop-layout">
    <!-- 頂部 Header：桌面用 navbar 橫向；平板/手機用 Offcanvas 選單 -->
    <header class="header header-sticky-mobile border-bottom bg-white">
      <nav class="navbar navbar-expand-lg navbar-light bg-white p-0">
        <div class="container-fluid px-0">
          <div class="row g-0 w-100 align-items-center flex-nowrap">
            <!-- Brand：始終顯示（平板/手機時與 toggler 同一列左側）；logoSrc 有值時顯示 logo 圖 -->
            <div class="col-auto">
              <a class="navbar-brand header-brand d-flex align-items-center gap-2" href="#">
                <img v-if="logoSrc" class="header-brand-logo" :src="logoSrc" alt="台灣電力公司" />
                <span class="header-brand-text text-white"></span>
              </a>
            </div>
            <!-- 平板/手機：漢堡按鈕與 logo 同一列、靠右 -->
            <div class="col-auto d-lg-none ms-auto">
              <button class="navbar-toggler border-0 py-2" type="button" data-bs-toggle="offcanvas"
                data-bs-target="#navbarOffcanvas" aria-controls="navbarOffcanvas" aria-label="開啟選單">
                <span class="navbar-toggler-icon"></span>
              </button>
            </div>
            <!-- 桌面：標題 + 使用者 + 按鈕 -->
            <div class="col d-none d-lg-flex align-items-center justify-content-between flex-nowrap min-width-0">
              <h1 class="header-title mb-0 me-3">檢驗輔助子系統</h1>
              <div class="d-flex align-items-center gap-3 me-3 flex-shrink-0">
                <div class="avatar rounded-circle bg-light d-flex align-items-center justify-content-center"><i
                    class="bi bi-person"></i></div>
                <div class="d-flex flex-column align-items-end">
                  <span class="user-name">林先生，您好</span>
                  <span class="user-role small">系統管理員</span>
                </div>
                <div class="header-actions d-flex gap-1">
                  <button type="button" class="btn btn-header-icon" aria-label="首頁"><i class="bi bi-house-fill"
                      aria-hidden="true"></i></button>
                  <button type="button" class="btn btn-header-icon" aria-label="報表"><i class="bi bi-file-earmark-text"
                      aria-hidden="true"></i></button>
                  <button type="button" class="btn btn-header-icon" aria-label="登出"><i class="bi bi-box-arrow-right"
                      aria-hidden="true"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Offcanvas：平板與手機選單 -->
      <div class="offcanvas offcanvas-end d-lg-none" tabindex="-1" id="navbarOffcanvas"
        aria-labelledby="navbarOffcanvasLabel">
        <div class="offcanvas-header border-bottom">
          <h2 class="offcanvas-title h5 mb-0" id="navbarOffcanvasLabel">選單</h2>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="關閉"></button>
        </div>
        <div class="offcanvas-body pt-3">
          <div class="d-flex align-items-center gap-3 mb-4">
            <div class="avatar rounded-circle bg-light d-flex align-items-center justify-content-center"><i
                class="bi bi-person"></i></div>
            <div class="d-flex flex-column">
              <span class="user-name">林先生，您好</span>
              <span class="user-role small">系統管理員</span>
            </div>
          </div>
          <div class="header-actions d-flex flex-column gap-2">
            <button type="button" class="btn btn-header-icon w-100 justify-content-center" aria-label="首頁"><i
                class="bi bi-house-fill me-2" aria-hidden="true"></i>首頁</button>
            <button type="button" class="btn btn-header-icon w-100 justify-content-center" aria-label="報表"><i
                class="bi bi-file-earmark-text me-2" aria-hidden="true"></i>報表</button>
            <button type="button" class="btn btn-header-icon w-100 justify-content-center" aria-label="登出"><i
                class="bi bi-box-arrow-right me-2" aria-hidden="true"></i>登出</button>
          </div>
        </div>
      </div>
      
      <div class="d-flex d-lg-none justify-content-center align-items-center bg-white">
        <h1 class="header-title h5 m-0 p-3 text-center">檢驗輔助子系統</h1>
      </div>
    </header>

    <main class="main container py-4">
      <RouterLink to="/" class="back-link d-inline-flex align-items-center gap-2 mb-2">
        <span class="back-link-icon" aria-hidden="true">&lsaquo;</span>
        <span class="back-link-text">回報項目</span>
      </RouterLink>
      <div class="back-link-meta d-lg-none mb-3">
        <span class="back-link-meta-item"><span class="back-link-meta-label">DCIS</span>：1230147</span>
        <span class="back-link-meta-sep" aria-hidden="true">|</span>
        <span class="back-link-meta-item"><span class="back-link-meta-label">工作班</span>：W7X02</span>
      </div>

      <!-- DCIS 資訊區（標籤固定寬度、欄位對齊） -->
      <section class="card mb-4">
        <div class="card-body">
          <div class="row g-3 mb-3">
            <div class="col-12 col-md-4 d-flex align-items-center gap-2">
              <label class="form-label dcis-label dcis-label-fixed mb-0 text-nowrap">DCIS</label>
              <input class="form-control" type="text" value="1230147" aria-label="DCIS" disabled />
            </div>
            <div class="col-12 col-md-4 d-flex align-items-center gap-2">
              <label class="form-label dcis-label dcis-label-fixed mb-0 text-nowrap">施工號碼</label>
              <input class="form-control" type="text" value="A2124024" aria-label="施工號碼" disabled />
            </div>
            <div class="col-12 col-md-4 d-flex align-items-center gap-2">
              <label class="form-label dcis-label dcis-label-fixed mb-0 text-nowrap">工作班</label>
              <input class="form-control" type="text" value="W7X02" aria-label="工作班" disabled />
            </div>
          </div>
          <div class="row g-3">
            <div class="col-12 d-flex align-items-center gap-2 dcis-location-row">
              <label class="form-label dcis-label dcis-label-fixed mb-0 text-nowrap d-block d-md-inline">地點</label>
              <input class="form-control" type="text" value="新北市板橋區懷德街66巷21號" aria-label="地點" disabled />
            </div>
          </div>
        </div>
      </section>

      <!-- 抽查表單區 -->
      <section class="card mb-4">
        <div class="row g-0 p-3 sticky-row-mobile border-3 border-bottom border-primary">
          <div class="col-6">
            <div class="d-flex justify-content-center align-items-center gap-2">
              <span class="">回報狀態項目</span>
            </div>
          </div>
          <div class="col-6">
            <div class="d-flex justify-content-center align-items-center gap-2">
              <span class="">回報狀態</span>
            </div>
          </div>
        </div>

        <div class="card-header pt-3 bg-white border-0">
          <div class="card-header-title">
            <span class="">開始抽查</span>
          </div>
        </div>
        <div class="card-body">
          <!-- 手風琴 -->
          <div class="accordion accordion-custom" id="accordionExample">
            <div class="accordion-item border-start-0 border-end-0">
              <div class="row">
                <div class="col-8">
                  <h2 class="accordion-header" id="headingOne">
                    <button class="accordion-button accordion-header-custom collapsed" type="button"
                      data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false"
                      aria-controls="collapseOne">
                      <span class="accordion-icon" aria-hidden="true"></span>
                      <span class="accordion-title">公共工程監造報表-外線</span>
                    </button>
                  </h2>
                </div>
                <div class="col-4 d-flex justify-content-center align-items-center">
                  <span class="badge bg-primary">已完成</span>
                </div>
              </div>
              <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne"
                data-bs-parent="#accordionExample">
                <div class="accordion-body">
                  <div>
                    <!-- 基本表單 -->
                    <div class="row g-3 mb-3">
                      <div class="col-md-6 d-flex align-items-center gap-2">
                        <label class="form-label dcis-label dcis-label-fixed mb-0 text-nowrap">工程名稱</label>
                        <input class="form-control" type="text" value="500積點管路 - 部分款" aria-label="工程名稱" disabled />
                      </div>
                      <div class="col-md-3 d-flex align-items-center gap-2">
                        <label class="form-label dcis-label dcis-label-fixed mb-0 text-nowrap">DSIC號碼</label>
                        <input class="form-control" type="text" value="5180004" aria-label="DSIC號碼" disabled />
                      </div>
                      <div class="col-md-3 d-flex align-items-center gap-2">
                        <label class="form-label dcis-label dcis-label-fixed mb-0 text-nowrap">承包商</label>
                        <input class="form-control" type="text" value="" aria-label="承包商" />
                      </div>
                    </div>
                    <div class="row g-3 mb-4">
                      <div class="col-md-3 d-flex align-items-center gap-2">
                        <label class="form-label dcis-label dcis-label-fixed mb-0 text-nowrap">抽查地點</label>
                        <input class="form-control" type="text" value="原街" aria-label="抽查地點" />
                      </div>
                      <div class="col-md-3 d-flex align-items-center gap-2">
                        <label class="form-label dcis-label dcis-label-fixed mb-0 text-nowrap">抽查日期</label>
                        <input type="date" class="form-control form-control-sm" />
                      </div>
                      <div class="col-md-3 d-flex align-items-center gap-2">
                        <label class="form-label dcis-label dcis-label-fixed mb-0 text-nowrap">抽查時機</label>
                        <select class="form-select form-select-sm" aria-label="抽查時機">
                          <option value="施工前抽查" selected>施工前抽查</option>
                          <option value="施工中抽查">施工中抽查</option>
                          <option value="施工後抽查">施工後抽查</option>
                        </select>
                      </div>
                    </div>
                    <!-- 類別表單：桌機左 nav、右 tabs；平板/手機為 nav 下方直接展開對應內容 -->
                    <div class="mb-3 category-nav-tabs">
                      <p class="form-category-title mb-0 mb-md-3 py-2 text-center">類別</p>
                      <!-- 平板/手機：每個 nav 下方展開對應內容 -->
                      <div class="category-mobile-accordion d-lg-none accordion" id="categoryAccordion1">
                        <div class="accordion-item category-mobile-item border-0 rounded-0">
                          <h3 class="accordion-header">
                            <button class="accordion-button category-mobile-nav collapsed py-3" type="button"
                              data-bs-toggle="collapse" data-bs-target="#cat1-plastic" aria-expanded="false"
                              aria-controls="cat1-plastic">塑膠硬管及配件類<i
                                class="bi bi-caret-right-fill category-mobile-caret" aria-hidden="true"></i></button>
                          </h3>
                          <div id="cat1-plastic" class="accordion-collapse collapse"
                            data-bs-parent="#categoryAccordion1">
                            <div class="accordion-body p-3 category-mobile-pane">
                              <div class="mb-3">
                                <label class="form-label">抽查項目：</label>
                                <span class="form-label-text">外觀（表面整齊，無缺損、無裂縫）</span>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">設計圖、規模之抽查標準（定量定性）：</label>
                                <ul>
                                  <li>彎曲麵以外適當位置以黑色噴漆或凹字方式標示製造廠商名稱或代號_______</li>
                                  <li>標示位置</li>
                                </ul>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">實際抽查情形（敘述抽查值）：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_plastic" class="form-check-input"
                                      type="radio" name="situation_plastic_m" id="s1a-m1" value="符合" />
                                    <label class="form-check-label" for="s1a-m1">符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_plastic" class="form-check-input"
                                      type="radio" name="situation_plastic_m" id="s2a-m1" value="不符合" />
                                    <label class="form-check-label" for="s2a-m1">不符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_plastic" class="form-check-input"
                                      type="radio" name="situation_plastic_m" id="s3a-m1" value="不回報" />
                                    <label class="form-check-label" for="s3a-m1">不回報</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">抽查結果：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_plastic" class="form-check-input" type="radio"
                                      name="result_plastic_m" id="r1a-m1" value="抽查合格" />
                                    <label class="form-check-label" for="r1a-m1">抽查合格</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_plastic" class="form-check-input" type="radio"
                                      name="result_plastic_m" id="r2a-m1" value="有缺失需改正" />
                                    <label class="form-check-label" for="r2a-m1">有缺失需改正</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_plastic" class="form-check-input" type="radio"
                                      name="result_plastic_m" id="r3a-m1" value="無此抽查項目" />
                                    <label class="form-check-label" for="r3a-m1">無此抽查項目</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-0">
                                <label class="form-label">備註：</label>
                                <textarea class="form-control form-control-sm" rows="3"></textarea>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="accordion-item category-mobile-item border-0 rounded-0">
                          <h3 class="accordion-header">
                            <button class="accordion-button category-mobile-nav collapsed py-3" type="button"
                              data-bs-toggle="collapse" data-bs-target="#cat1-concrete" aria-expanded="false"
                              aria-controls="cat1-concrete">混凝土管路隔離版<i
                                class="bi bi-caret-right-fill category-mobile-caret" aria-hidden="true"></i></button>
                          </h3>
                          <div id="cat1-concrete" class="accordion-collapse collapse"
                            data-bs-parent="#categoryAccordion1">
                            <div class="accordion-body p-3 category-mobile-pane">
                              <div class="mb-3">
                                <label class="form-label">抽查項目：</label>
                                <span class="form-label-text">外觀（表面整齊，無缺損、無裂縫）</span>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">設計圖、規模之抽查標準（定量定性）：</label>
                                <ul>
                                  <li>彎曲麵以外適當位置以黑色噴漆或凹字方式標示製造廠商名稱或代號_______</li>
                                  <li>標示位置</li>
                                </ul>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">實際抽查情形（敘述抽查值）：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_concrete" class="form-check-input"
                                      type="radio" name="situation_concrete_m" id="s1b-m1" value="符合" />
                                    <label class="form-check-label" for="s1b-m1">符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_concrete" class="form-check-input"
                                      type="radio" name="situation_concrete_m" id="s2b-m1" value="不符合" />
                                    <label class="form-check-label" for="s2b-m1">不符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_concrete" class="form-check-input"
                                      type="radio" name="situation_concrete_m" id="s3b-m1" value="不回報" />
                                    <label class="form-check-label" for="s3b-m1">不回報</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">抽查結果：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_concrete" class="form-check-input" type="radio"
                                      name="result_concrete_m" id="r1b-m1" value="抽查合格" />
                                    <label class="form-check-label" for="r1b-m1">抽查合格</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_concrete" class="form-check-input" type="radio"
                                      name="result_concrete_m" id="r2b-m1" value="有缺失需改正" />
                                    <label class="form-check-label" for="r2b-m1">有缺失需改正</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_concrete" class="form-check-input" type="radio"
                                      name="result_concrete_m" id="r3b-m1" value="無此抽查項目" />
                                    <label class="form-check-label" for="r3b-m1">無此抽查項目</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-0">
                                <label class="form-label">備註：</label>
                                <textarea class="form-control form-control-sm" rows="3"></textarea>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="accordion-item category-mobile-item border-0 rounded-0">
                          <h3 class="accordion-header">
                            <button class="accordion-button category-mobile-nav collapsed py-3" type="button"
                              data-bs-toggle="collapse" data-bs-target="#cat1-manhole" aria-expanded="false"
                              aria-controls="cat1-manhole">預鑄人孔<i class="bi bi-caret-right-fill category-mobile-caret"
                                aria-hidden="true"></i></button>
                          </h3>
                          <div id="cat1-manhole" class="accordion-collapse collapse"
                            data-bs-parent="#categoryAccordion1">
                            <div class="accordion-body p-3 category-mobile-pane">
                              <div class="mb-3">
                                <label class="form-label">抽查項目：</label>
                                <span class="form-label-text">外觀（表面整齊，無缺損、無裂縫）</span>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">設計圖、規模之抽查標準（定量定性）：</label>
                                <ul>
                                  <li>彎曲麵以外適當位置以黑色噴漆或凹字方式標示製造廠商名稱或代號_______</li>
                                  <li>標示位置</li>
                                </ul>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">實際抽查情形（敘述抽查值）：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_manhole" class="form-check-input"
                                      type="radio" name="situation_manhole_m" id="s1c-m1" value="符合" />
                                    <label class="form-check-label" for="s1c-m1">符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_manhole" class="form-check-input"
                                      type="radio" name="situation_manhole_m" id="s2c-m1" value="不符合" />
                                    <label class="form-check-label" for="s2c-m1">不符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_manhole" class="form-check-input"
                                      type="radio" name="situation_manhole_m" id="s3c-m1" value="不回報" />
                                    <label class="form-check-label" for="s3c-m1">不回報</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">抽查結果：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_manhole" class="form-check-input" type="radio"
                                      name="result_manhole_m" id="r1c-m1" value="抽查合格" />
                                    <label class="form-check-label" for="r1c-m1">抽查合格</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_manhole" class="form-check-input" type="radio"
                                      name="result_manhole_m" id="r2c-m1" value="有缺失需改正" />
                                    <label class="form-check-label" for="r2c-m1">有缺失需改正</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_manhole" class="form-check-input" type="radio"
                                      name="result_manhole_m" id="r3c-m1" value="無此抽查項目" />
                                    <label class="form-check-label" for="r3c-m1">無此抽查項目</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-0">
                                <label class="form-label">備註：</label>
                                <textarea class="form-control form-control-sm" rows="3"></textarea>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="accordion-item category-mobile-item border-0 rounded-0">
                          <h3 class="accordion-header">
                            <button class="accordion-button category-mobile-nav collapsed py-3" type="button"
                              data-bs-toggle="collapse" data-bs-target="#cat1-handhole" aria-expanded="false"
                              aria-controls="cat1-handhole">預鑄手孔<i class="bi bi-caret-right-fill category-mobile-caret"
                                aria-hidden="true"></i></button>
                          </h3>
                          <div id="cat1-handhole" class="accordion-collapse collapse"
                            data-bs-parent="#categoryAccordion1">
                            <div class="accordion-body p-3 category-mobile-pane">
                              <div class="mb-3">
                                <label class="form-label">抽查項目：</label>
                                <span class="form-label-text">外觀（表面整齊，無缺損、無裂縫）</span>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">設計圖、規模之抽查標準（定量定性）：</label>
                                <ul>
                                  <li>彎曲麵以外適當位置以黑色噴漆或凹字方式標示製造廠商名稱或代號_______</li>
                                  <li>標示位置</li>
                                </ul>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">實際抽查情形（敘述抽查值）：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_handhole" class="form-check-input"
                                      type="radio" name="situation_handhole_m" id="s1d-m1" value="符合" />
                                    <label class="form-check-label" for="s1d-m1">符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_handhole" class="form-check-input"
                                      type="radio" name="situation_handhole_m" id="s2d-m1" value="不符合" />
                                    <label class="form-check-label" for="s2d-m1">不符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_handhole" class="form-check-input"
                                      type="radio" name="situation_handhole_m" id="s3d-m1" value="不回報" />
                                    <label class="form-check-label" for="s3d-m1">不回報</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">抽查結果：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_handhole" class="form-check-input" type="radio"
                                      name="result_handhole_m" id="r1d-m1" value="抽查合格" />
                                    <label class="form-check-label" for="r1d-m1">抽查合格</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_handhole" class="form-check-input" type="radio"
                                      name="result_handhole_m" id="r2d-m1" value="有缺失需改正" />
                                    <label class="form-check-label" for="r2d-m1">有缺失需改正</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_handhole" class="form-check-input" type="radio"
                                      name="result_handhole_m" id="r3d-m1" value="無此抽查項目" />
                                    <label class="form-check-label" for="r3d-m1">無此抽查項目</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-0">
                                <label class="form-label">備註：</label>
                                <textarea class="form-control form-control-sm" rows="3"></textarea>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- 桌機：左 nav、右 tab content -->
                      <div class="row gx-5 d-none d-lg-flex">
                        <div class="col-lg-3">
                          <nav class="nav flex-column category-nav border-0 shadow-none" role="tablist">
                            <button class="nav-link form-category-item active" type="button" role="tab"
                              data-bs-toggle="tab" data-bs-target="#tab-plastic" aria-selected="true"
                              aria-controls="tab-plastic">塑膠硬管及配件類</button>
                            <button class="nav-link form-category-item" type="button" role="tab" data-bs-toggle="tab"
                              data-bs-target="#tab-concrete" aria-selected="false"
                              aria-controls="tab-concrete">混凝土管路隔離版</button>
                            <button class="nav-link form-category-item" type="button" role="tab" data-bs-toggle="tab"
                              data-bs-target="#tab-manhole" aria-selected="false"
                              aria-controls="tab-manhole">預鑄人孔</button>
                            <button class="nav-link form-category-item" type="button" role="tab" data-bs-toggle="tab"
                              data-bs-target="#tab-handhole" aria-selected="false"
                              aria-controls="tab-handhole">預鑄手孔</button>
                          </nav>
                        </div>
                        <div class="col-lg-9 tab-content-wrapper ps-0 border-0 shadow-none">
                          <div class="tab-content p-3" id="categoryTabContent">
                            <div class="tab-pane fade show active" id="tab-plastic" role="tabpanel">
                              <div class="mb-3">
                                <label class="form-label">抽查項目：</label>
                                <span class="form-label-text">外觀（表面整齊，無缺損、無裂縫）</span>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">設計圖、規模之抽查標準（定量定性）：</label>
                                <ul>
                                  <li>彎曲麵以外適當位置以黑色噴漆或凹字方式標示製造廠商名稱或代號_______</li>
                                  <li>標示位置</li>
                                </ul>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">實際抽查情形（敘述抽查值）：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_plastic" class="form-check-input"
                                      type="radio" name="situation_plastic" id="s1a" value="符合" />
                                    <label class="form-check-label" for="s1a">符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_plastic" class="form-check-input"
                                      type="radio" name="situation_plastic" id="s2a" value="不符合" />
                                    <label class="form-check-label" for="s2a">不符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_plastic" class="form-check-input"
                                      type="radio" name="situation_plastic" id="s3a" value="不回報" />
                                    <label class="form-check-label" for="s3a">不回報</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">抽查結果：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_plastic" class="form-check-input" type="radio"
                                      name="result_plastic" id="r1a" value="抽查合格" />
                                    <label class="form-check-label" for="r1a">抽查合格</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_plastic" class="form-check-input" type="radio"
                                      name="result_plastic" id="r2a" value="有缺失需改正" />
                                    <label class="form-check-label" for="r2a">有缺失需改正</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_plastic" class="form-check-input" type="radio"
                                      name="result_plastic" id="r3a" value="無此抽查項目" />
                                    <label class="form-check-label" for="r3a">無此抽查項目</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-0">
                                <label class="form-label">備註：</label>
                                <textarea class="form-control form-control-sm" rows="3"></textarea>
                              </div>
                            </div>

                            <div class="tab-pane fade" id="tab-concrete" role="tabpanel">
                              <div class="mb-3">
                                <label class="form-label">抽查項目：</label>
                                <span class="form-label-text">外觀（表面整齊，無缺損、無裂縫）</span>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">設計圖、規模之抽查標準（定量定性）：</label>
                                <ul>
                                  <li>彎曲麵以外適當位置以黑色噴漆或凹字方式標示製造廠商名稱或代號_______</li>
                                  <li>標示位置</li>
                                </ul>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">實際抽查情形（敘述抽查值）：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_concrete" class="form-check-input"
                                      type="radio" name="situation_concrete" id="s1b" value="符合" />
                                    <label class="form-check-label" for="s1b">符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_concrete" class="form-check-input"
                                      type="radio" name="situation_concrete" id="s2b" value="不符合" />
                                    <label class="form-check-label" for="s2b">不符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_concrete" class="form-check-input"
                                      type="radio" name="situation_concrete" id="s3b" value="不回報" />
                                    <label class="form-check-label" for="s3b">不回報</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">抽查結果：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_concrete" class="form-check-input" type="radio"
                                      name="result_concrete" id="r1b" value="抽查合格" />
                                    <label class="form-check-label" for="r1b">抽查合格</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_concrete" class="form-check-input" type="radio"
                                      name="result_concrete" id="r2b" value="有缺失需改正" />
                                    <label class="form-check-label" for="r2b">有缺失需改正</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_concrete" class="form-check-input" type="radio"
                                      name="result_concrete" id="r3b" value="無此抽查項目" />
                                    <label class="form-check-label" for="r3b">無此抽查項目</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-0">
                                <label class="form-label">備註：</label>
                                <textarea class="form-control form-control-sm" rows="3"></textarea>
                              </div>
                            </div>
                            <div class="tab-pane fade" id="tab-manhole" role="tabpanel">
                              <div class="mb-3">
                                <label class="form-label">抽查項目：</label>
                                <span class="form-label-text">外觀（表面整齊，無缺損、無裂縫）</span>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">設計圖、規模之抽查標準（定量定性）：</label>
                                <ul>
                                  <li>彎曲麵以外適當位置以黑色噴漆或凹字方式標示製造廠商名稱或代號_______</li>
                                  <li>標示位置</li>
                                </ul>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">實際抽查情形（敘述抽查值）：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_manhole" class="form-check-input"
                                      type="radio" name="situation_manhole" id="s1c" value="符合" />
                                    <label class="form-check-label" for="s1c">符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_manhole" class="form-check-input"
                                      type="radio" name="situation_manhole" id="s2c" value="不符合" />
                                    <label class="form-check-label" for="s2c">不符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_manhole" class="form-check-input"
                                      type="radio" name="situation_manhole" id="s3c" value="不回報" />
                                    <label class="form-check-label" for="s3c">不回報</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">抽查結果：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_manhole" class="form-check-input" type="radio"
                                      name="result_manhole" id="r1c" value="抽查合格" />
                                    <label class="form-check-label" for="r1c">抽查合格</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_manhole" class="form-check-input" type="radio"
                                      name="result_manhole" id="r2c" value="有缺失需改正" />
                                    <label class="form-check-label" for="r2c">有缺失需改正</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_manhole" class="form-check-input" type="radio"
                                      name="result_manhole" id="r3c" value="無此抽查項目" />
                                    <label class="form-check-label" for="r3c">無此抽查項目</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-0">
                                <label class="form-label">備註：</label>
                                <textarea class="form-control form-control-sm" rows="3"></textarea>
                              </div>
                            </div>
                            <div class="tab-pane fade" id="tab-handhole" role="tabpanel">
                              <div class="mb-3">
                                <label class="form-label">抽查項目：</label>
                                <span class="form-label-text">外觀（表面整齊，無缺損、無裂縫）</span>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">設計圖、規模之抽查標準（定量定性）：</label>
                                <ul>
                                  <li>彎曲麵以外適當位置以黑色噴漆或凹字方式標示製造廠商名稱或代號_______</li>
                                  <li>標示位置</li>
                                </ul>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">實際抽查情形（敘述抽查值）：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_handhole" class="form-check-input"
                                      type="radio" name="situation_handhole" id="s1d" value="符合" />
                                    <label class="form-check-label" for="s1d">符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_handhole" class="form-check-input"
                                      type="radio" name="situation_handhole" id="s2d" value="不符合" />
                                    <label class="form-check-label" for="s2d">不符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_handhole" class="form-check-input"
                                      type="radio" name="situation_handhole" id="s3d" value="不回報" />
                                    <label class="form-check-label" for="s3d">不回報</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">抽查結果：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_handhole" class="form-check-input" type="radio"
                                      name="result_handhole" id="r1d" value="抽查合格" />
                                    <label class="form-check-label" for="r1d">抽查合格</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_handhole" class="form-check-input" type="radio"
                                      name="result_handhole" id="r2d" value="有缺失需改正" />
                                    <label class="form-check-label" for="r2d">有缺失需改正</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_handhole" class="form-check-input" type="radio"
                                      name="result_handhole" id="r3d" value="無此抽查項目" />
                                    <label class="form-check-label" for="r3d">無此抽查項目</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-0">
                                <label class="form-label">備註：</label>
                                <textarea class="form-control form-control-sm" rows="3"></textarea>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="row g-3 my-3 signature-area border-top">
                      <!-- <div class="col-12"> -->
                      <div class="row g-3">
                        <div class="col-3 col-md-2 col-lg-1">
                          <label class="form-label">環保督導</label>
                        </div>
                        <div class="col-9 col-md-10 col-lg-2">
                          <select class="form-select form-select-sm">
                            <option value="">—</option>
                            <option value="工環人員" selected>工環人員</option>
                          </select>
                        </div>
                        <div class="col-12 col-lg-9">
                          <input type="text" class="form-control form-control-sm" placeholder="" />
                        </div>
                      </div>
                      <div class="row g-3">
                        <div class="col-3 col-md-2 col-lg-1">
                          <label class="form-label">其他</label>
                        </div>
                        <div class="col-9 col-md-10 col-lg-2">
                          <select class="form-select form-select-sm">
                            <option value="">—</option>
                            <option value="機關取締" selected>機關取締</option>
                          </select>
                        </div>
                        <div class="col-12 col-lg-9">
                          <input type="text" class="form-control form-control-sm" placeholder="" />
                        </div>
                      </div>
                      <div class="row g-3">
                        <div class="col-md-1">
                          <label class="form-label">現場檢驗員簽名</label>
                        </div>
                        <div class="col-md-11">
                          <div class="signature-pad-wrap border rounded bg-white">
                            <canvas ref="canvasRef0" class="signature-pad-canvas" aria-label="簽名板"></canvas>
                            <button type="button" class="btn btn-outline-secondary btn-sm mt-1"
                              @click="clearSignature(0)">清除</button>
                          </div>
                          <p class="sign-note-red small mt-3 mb-1">＊必須親自簽名，並押日期，若為代理人，必須加註"代"</p>
                          <p class="text-muted small mb-0">註：本表須併承攬商同一日之『公共工程施工日誌』陳核後併工作單存查。</p>
                        </div>
                      </div>
                      <!-- </div> -->

                    </div>

                    <div class="row g-4 button-area">
                      <div class="d-flex flex-column gap-3 w-100 d-md-none p-0">
                        <div class="row g-3 justify-content-between align-items-center w-100 p-0">
                          <div class="col-6">
                            <button type="button" class="btn btn-lg btn-cancel w-100">取消</button>
                          </div>
                          <div class="col-6">
                            <button type="button" class="btn btn-lg btn-save w-100">暫存</button>
                          </div>
                          <div class="col-12">
                            <button type="button" class="btn btn-lg btn-upload w-100">上傳</button>
                          </div>
                        </div>
                      </div>
                      <div class="d-none d-md-flex gap-2 justify-content-end">
                        <button type="button" class="btn btn-lg btn-cancel">取消</button>
                        <button type="button" class="btn btn-lg btn-save">暫存</button>
                        <button type="button" class="btn btn-lg btn-upload">上傳</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="accordion-item border-start-0 border-end-0">
              <div class="row">
                <div class="col-8">
                  <h2 class="accordion-header" id="headingTwo">
                    <button class="accordion-button accordion-header-custom" type="button" data-bs-toggle="collapse"
                      data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                      <span class="accordion-icon" aria-hidden="true"></span>
                      <span class="accordion-title">配電工程帶料材料外觀抽查表-外線</span>
                    </button>
                  </h2>
                </div>
                <div class="col-4 d-flex justify-content-center align-items-center">
                  <!-- 有回報的話，顯示已完成 -->
                  <!-- <span class="badge bg-primary">已完成</span> -->
                </div>
              </div>
              <div id="collapseTwo" class="accordion-collapse collapse show" aria-labelledby="headingTwo"
                data-bs-parent="#accordionExample">
                <div class="accordion-body">
                  <div>
                    <div class="row g-3 mb-3">
                      <div class="col-md-6 d-flex align-items-center gap-2">
                        <label class="form-label dcis-label dcis-label-fixed mb-0 text-nowrap">工程名稱</label>
                        <input class="form-control" type="text" value="500積點管路 - 部分款" aria-label="工程名稱" disabled />
                      </div>
                      <div class="col-md-3 d-flex align-items-center gap-2">
                        <label class="form-label dcis-label dcis-label-fixed mb-0 text-nowrap">DSIC號碼</label>
                        <input class="form-control" type="text" value="5180004" aria-label="DSIC號碼" disabled />
                      </div>
                      <div class="col-md-3 d-flex align-items-center gap-2">
                        <label class="form-label dcis-label dcis-label-fixed mb-0 text-nowrap">承包商</label>
                        <input class="form-control" type="text" value="" aria-label="承包商" />
                      </div>
                    </div>
                    <div class="row g-3 mb-4">
                      <div class="col-md-3 d-flex align-items-center gap-2">
                        <label class="form-label dcis-label dcis-label-fixed mb-0 text-nowrap">抽查地點</label>
                        <input class="form-control" type="text" value="原街" aria-label="抽查地點" />
                      </div>
                      <div class="col-md-3 d-flex align-items-center gap-2">
                        <label class="form-label dcis-label dcis-label-fixed mb-0 text-nowrap">抽查日期</label>
                        <input type="date" class="form-control form-control-sm" />
                      </div>
                      <div class="col-md-3 d-flex align-items-center gap-2">
                        <label class="form-label dcis-label dcis-label-fixed mb-0 text-nowrap">抽查時機</label>
                        <select class="form-select form-select-sm" aria-label="抽查時機">
                          <option value="施工前抽查" selected>施工前抽查</option>
                          <option value="施工中抽查">施工中抽查</option>
                          <option value="施工後抽查">施工後抽查</option>
                        </select>
                      </div>
                    </div>
                    <div class="mb-3 category-nav-tabs">
                      <p class="form-category-title mb-0 mb-md-3 py-2 text-center">類別</p>
                      <div class="category-mobile-accordion d-lg-none accordion" id="categoryAccordion2">
                        <div class="accordion-item category-mobile-item border-0">
                          <h3 class="accordion-header">
                            <button class="accordion-button category-mobile-nav collapsed py-3" type="button"
                              data-bs-toggle="collapse" data-bs-target="#cat2-plastic" aria-expanded="false"
                              aria-controls="cat2-plastic">塑膠硬管及配件類<i
                                class="bi bi-caret-right-fill category-mobile-caret" aria-hidden="true"></i></button>
                          </h3>
                          <div id="cat2-plastic" class="accordion-collapse collapse"
                            data-bs-parent="#categoryAccordion2">
                            <div class="accordion-body p-3 category-mobile-pane">
                              <div class="mb-3"><label class="form-label">抽查項目：</label><span
                                  class="form-label-text">外觀（表面整齊，無缺損、無裂縫）</span></div>
                              <div class="mb-3"><label class="form-label">設計圖、規模之抽查標準（定量定性）：</label>
                                <ul>
                                  <li>彎曲麵以外適當位置以黑色噴漆或凹字方式標示製造廠商名稱或代號_______</li>
                                  <li>標示位置</li>
                                </ul>
                              </div>
                              <div class="mb-3"><label class="form-label">實際抽查情形（敘述抽查值）：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline"><input
                                      v-model="categoryForm.situation_plastic_2" class="form-check-input" type="radio"
                                      name="situation_plastic_2_m" id="s1a-m2" value="符合" /><label
                                      class="form-check-label" for="s1a-m2">符合</label></div>
                                  <div class="form-check form-check-inline"><input
                                      v-model="categoryForm.situation_plastic_2" class="form-check-input" type="radio"
                                      name="situation_plastic_2_m" id="s2a-m2" value="不符合" /><label
                                      class="form-check-label" for="s2a-m2">不符合</label></div>
                                  <div class="form-check form-check-inline"><input
                                      v-model="categoryForm.situation_plastic_2" class="form-check-input" type="radio"
                                      name="situation_plastic_2_m" id="s3a-m2" value="不回報" /><label
                                      class="form-check-label" for="s3a-m2">不回報</label></div>
                                </div>
                              </div>
                              <div class="mb-3"><label class="form-label">抽查結果：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline"><input
                                      v-model="categoryForm.result_plastic_2" class="form-check-input" type="radio"
                                      name="result_plastic_2_m" id="r1a-m2" value="抽查合格" /><label
                                      class="form-check-label" for="r1a-m2">抽查合格</label></div>
                                  <div class="form-check form-check-inline"><input
                                      v-model="categoryForm.result_plastic_2" class="form-check-input" type="radio"
                                      name="result_plastic_2_m" id="r2a-m2" value="有缺失需改正" /><label
                                      class="form-check-label" for="r2a-m2">有缺失需改正</label></div>
                                  <div class="form-check form-check-inline"><input
                                      v-model="categoryForm.result_plastic_2" class="form-check-input" type="radio"
                                      name="result_plastic_2_m" id="r3a-m2" value="無此抽查項目" /><label
                                      class="form-check-label" for="r3a-m2">無此抽查項目</label></div>
                                </div>
                              </div>
                              <div class="mb-0"><label class="form-label">備註：</label><textarea
                                  class="form-control form-control-sm" rows="3"></textarea></div>
                            </div>
                          </div>
                        </div>
                        <div class="accordion-item category-mobile-item border-0">
                          <h3 class="accordion-header">
                            <button class="accordion-button category-mobile-nav collapsed py-3" type="button"
                              data-bs-toggle="collapse" data-bs-target="#cat2-concrete" aria-expanded="false"
                              aria-controls="cat2-concrete">混凝土管路隔離版<i
                                class="bi bi-caret-right-fill category-mobile-caret" aria-hidden="true"></i></button>
                          </h3>
                          <div id="cat2-concrete" class="accordion-collapse collapse"
                            data-bs-parent="#categoryAccordion2">
                            <div class="accordion-body p-3 category-mobile-pane">
                              <div class="mb-3"><label class="form-label">抽查項目：</label><span
                                  class="form-label-text">外觀（表面整齊，無缺損、無裂縫）</span></div>
                              <div class="mb-3"><label class="form-label">設計圖、規模之抽查標準（定量定性）：</label>
                                <ul>
                                  <li>彎曲麵以外適當位置以黑色噴漆或凹字方式標示製造廠商名稱或代號_______</li>
                                  <li>標示位置</li>
                                </ul>
                              </div>
                              <div class="mb-3"><label class="form-label">實際抽查情形（敘述抽查值）：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline"><input
                                      v-model="categoryForm.situation_concrete_2" class="form-check-input" type="radio"
                                      name="situation_concrete_2_m" id="s1b-m2" value="符合" /><label
                                      class="form-check-label" for="s1b-m2">符合</label></div>
                                  <div class="form-check form-check-inline"><input
                                      v-model="categoryForm.situation_concrete_2" class="form-check-input" type="radio"
                                      name="situation_concrete_2_m" id="s2b-m2" value="不符合" /><label
                                      class="form-check-label" for="s2b-m2">不符合</label></div>
                                  <div class="form-check form-check-inline"><input
                                      v-model="categoryForm.situation_concrete_2" class="form-check-input" type="radio"
                                      name="situation_concrete_2_m" id="s3b-m2" value="不回報" /><label
                                      class="form-check-label" for="s3b-m2">不回報</label></div>
                                </div>
                              </div>
                              <div class="mb-3"><label class="form-label">抽查結果：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline"><input
                                      v-model="categoryForm.result_concrete_2" class="form-check-input" type="radio"
                                      name="result_concrete_2_m" id="r1b-m2" value="抽查合格" /><label
                                      class="form-check-label" for="r1b-m2">抽查合格</label></div>
                                  <div class="form-check form-check-inline"><input
                                      v-model="categoryForm.result_concrete_2" class="form-check-input" type="radio"
                                      name="result_concrete_2_m" id="r2b-m2" value="有缺失需改正" /><label
                                      class="form-check-label" for="r2b-m2">有缺失需改正</label></div>
                                  <div class="form-check form-check-inline"><input
                                      v-model="categoryForm.result_concrete_2" class="form-check-input" type="radio"
                                      name="result_concrete_2_m" id="r3b-m2" value="無此抽查項目" /><label
                                      class="form-check-label" for="r3b-m2">無此抽查項目</label></div>
                                </div>
                              </div>
                              <div class="mb-0"><label class="form-label">備註：</label><textarea
                                  class="form-control form-control-sm" rows="3"></textarea></div>
                            </div>
                          </div>
                        </div>
                        <div class="accordion-item category-mobile-item border-0">
                          <h3 class="accordion-header">
                            <button class="accordion-button category-mobile-nav collapsed py-3" type="button"
                              data-bs-toggle="collapse" data-bs-target="#cat2-manhole" aria-expanded="false"
                              aria-controls="cat2-manhole">預鑄人孔<i class="bi bi-caret-right-fill category-mobile-caret"
                                aria-hidden="true"></i></button>
                          </h3>
                          <div id="cat2-manhole" class="accordion-collapse collapse"
                            data-bs-parent="#categoryAccordion2">
                            <div class="accordion-body p-3 category-mobile-pane">
                              <div class="mb-3"><label class="form-label">抽查項目：</label><span
                                  class="form-label-text">外觀（表面整齊，無缺損、無裂縫）</span></div>
                              <div class="mb-3"><label class="form-label">設計圖、規模之抽查標準（定量定性）：</label>
                                <ul>
                                  <li>彎曲麵以外適當位置以黑色噴漆或凹字方式標示製造廠商名稱或代號_______</li>
                                  <li>標示位置</li>
                                </ul>
                              </div>
                              <div class="mb-3"><label class="form-label">實際抽查情形（敘述抽查值）：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline"><input
                                      v-model="categoryForm.situation_manhole_2" class="form-check-input" type="radio"
                                      name="situation_manhole_2_m" id="s1c-m2" value="符合" /><label
                                      class="form-check-label" for="s1c-m2">符合</label></div>
                                  <div class="form-check form-check-inline"><input
                                      v-model="categoryForm.situation_manhole_2" class="form-check-input" type="radio"
                                      name="situation_manhole_2_m" id="s2c-m2" value="不符合" /><label
                                      class="form-check-label" for="s2c-m2">不符合</label></div>
                                  <div class="form-check form-check-inline"><input
                                      v-model="categoryForm.situation_manhole_2" class="form-check-input" type="radio"
                                      name="situation_manhole_2_m" id="s3c-m2" value="不回報" /><label
                                      class="form-check-label" for="s3c-m2">不回報</label></div>
                                </div>
                              </div>
                              <div class="mb-3"><label class="form-label">抽查結果：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline"><input
                                      v-model="categoryForm.result_manhole_2" class="form-check-input" type="radio"
                                      name="result_manhole_2_m" id="r1c-m2" value="抽查合格" /><label
                                      class="form-check-label" for="r1c-m2">抽查合格</label></div>
                                  <div class="form-check form-check-inline"><input
                                      v-model="categoryForm.result_manhole_2" class="form-check-input" type="radio"
                                      name="result_manhole_2_m" id="r2c-m2" value="有缺失需改正" /><label
                                      class="form-check-label" for="r2c-m2">有缺失需改正</label></div>
                                  <div class="form-check form-check-inline"><input
                                      v-model="categoryForm.result_manhole_2" class="form-check-input" type="radio"
                                      name="result_manhole_2_m" id="r3c-m2" value="無此抽查項目" /><label
                                      class="form-check-label" for="r3c-m2">無此抽查項目</label></div>
                                </div>
                              </div>
                              <div class="mb-0"><label class="form-label">備註：</label><textarea
                                  class="form-control form-control-sm" rows="3"></textarea></div>
                            </div>
                          </div>
                        </div>
                        <div class="accordion-item category-mobile-item border-0">
                          <h3 class="accordion-header">
                            <button class="accordion-button category-mobile-nav collapsed py-3" type="button"
                              data-bs-toggle="collapse" data-bs-target="#cat2-handhole" aria-expanded="false"
                              aria-controls="cat2-handhole">預鑄手孔<i class="bi bi-caret-right-fill category-mobile-caret"
                                aria-hidden="true"></i></button>
                          </h3>
                          <div id="cat2-handhole" class="accordion-collapse collapse"
                            data-bs-parent="#categoryAccordion2">
                            <div class="accordion-body p-3 category-mobile-pane">
                              <div class="mb-3"><label class="form-label">抽查項目：</label><span
                                  class="form-label-text">外觀（表面整齊，無缺損、無裂縫）</span></div>
                              <div class="mb-3"><label class="form-label">設計圖、規模之抽查標準（定量定性）：</label>
                                <ul>
                                  <li>彎曲麵以外適當位置以黑色噴漆或凹字方式標示製造廠商名稱或代號_______</li>
                                  <li>標示位置</li>
                                </ul>
                              </div>
                              <div class="mb-3"><label class="form-label">實際抽查情形（敘述抽查值）：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline"><input
                                      v-model="categoryForm.situation_handhole_2" class="form-check-input" type="radio"
                                      name="situation_handhole_2_m" id="s1d-m2" value="符合" /><label
                                      class="form-check-label" for="s1d-m2">符合</label></div>
                                  <div class="form-check form-check-inline"><input
                                      v-model="categoryForm.situation_handhole_2" class="form-check-input" type="radio"
                                      name="situation_handhole_2_m" id="s2d-m2" value="不符合" /><label
                                      class="form-check-label" for="s2d-m2">不符合</label></div>
                                  <div class="form-check form-check-inline"><input
                                      v-model="categoryForm.situation_handhole_2" class="form-check-input" type="radio"
                                      name="situation_handhole_2_m" id="s3d-m2" value="不回報" /><label
                                      class="form-check-label" for="s3d-m2">不回報</label></div>
                                </div>
                              </div>
                              <div class="mb-3"><label class="form-label">抽查結果：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline"><input
                                      v-model="categoryForm.result_handhole_2" class="form-check-input" type="radio"
                                      name="result_handhole_2_m" id="r1d-m2" value="抽查合格" /><label
                                      class="form-check-label" for="r1d-m2">抽查合格</label></div>
                                  <div class="form-check form-check-inline"><input
                                      v-model="categoryForm.result_handhole_2" class="form-check-input" type="radio"
                                      name="result_handhole_2_m" id="r2d-m2" value="有缺失需改正" /><label
                                      class="form-check-label" for="r2d-m2">有缺失需改正</label></div>
                                  <div class="form-check form-check-inline"><input
                                      v-model="categoryForm.result_handhole_2" class="form-check-input" type="radio"
                                      name="result_handhole_2_m" id="r3d-m2" value="無此抽查項目" /><label
                                      class="form-check-label" for="r3d-m2">無此抽查項目</label></div>
                                </div>
                              </div>
                              <div class="mb-0"><label class="form-label">備註：</label><textarea
                                  class="form-control form-control-sm" rows="3"></textarea></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row gx-5 d-none d-lg-flex">
                        <div class="col-lg-3">
                          <nav class="nav flex-column category-nav border-0 shadow-none" role="tablist">
                            <button class="nav-link form-category-item active" type="button" role="tab"
                              data-bs-toggle="tab" data-bs-target="#tab-plastic-2" aria-selected="true"
                              aria-controls="tab-plastic-2">塑膠硬管及配件類</button>
                            <button class="nav-link form-category-item" type="button" role="tab" data-bs-toggle="tab"
                              data-bs-target="#tab-concrete-2" aria-selected="false"
                              aria-controls="tab-concrete-2">混凝土管路隔離版</button>
                            <button class="nav-link form-category-item" type="button" role="tab" data-bs-toggle="tab"
                              data-bs-target="#tab-manhole-2" aria-selected="false"
                              aria-controls="tab-manhole-2">預鑄人孔</button>
                            <button class="nav-link form-category-item" type="button" role="tab" data-bs-toggle="tab"
                              data-bs-target="#tab-handhole-2" aria-selected="false"
                              aria-controls="tab-handhole-2">預鑄手孔</button>
                          </nav>
                        </div>
                        <div class="col-lg-9 tab-content-wrapper ps-0 border-0 shadow-none">
                          <div class="tab-content p-3" id="categoryTabContent2">
                            <div class="tab-pane fade show active" id="tab-plastic-2" role="tabpanel">
                              <div class="mb-3">
                                <label class="form-label">抽查項目：</label>
                                <span class="form-label-text">外觀（表面整齊，無缺損、無裂縫）</span>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">設計圖、規模之抽查標準（定量定性）：</label>
                                <ul>
                                  <li>彎曲麵以外適當位置以黑色噴漆或凹字方式標示製造廠商名稱或代號_______</li>
                                  <li>標示位置</li>
                                </ul>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">實際抽查情形（敘述抽查值）：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_plastic_2" class="form-check-input"
                                      type="radio" name="situation_plastic_2" id="s1a_2" value="符合" />
                                    <label class="form-check-label" for="s1a_2">符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_plastic_2" class="form-check-input"
                                      type="radio" name="situation_plastic_2" id="s2a_2" value="不符合" />
                                    <label class="form-check-label" for="s2a_2">不符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_plastic_2" class="form-check-input"
                                      type="radio" name="situation_plastic_2" id="s3a_2" value="不回報" />
                                    <label class="form-check-label" for="s3a_2">不回報</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">抽查結果：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_plastic_2" class="form-check-input" type="radio"
                                      name="result_plastic_2" id="r1a_2" value="抽查合格" />
                                    <label class="form-check-label" for="r1a_2">抽查合格</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_plastic_2" class="form-check-input" type="radio"
                                      name="result_plastic_2" id="r2a_2" value="有缺失需改正" />
                                    <label class="form-check-label" for="r2a_2">有缺失需改正</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="result_plastic_2" id="r3a_2"
                                      value="無此抽查項目" />
                                    <label class="form-check-label" for="r3a_2">無此抽查項目</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-0">
                                <label class="form-label">備註：</label>
                                <textarea class="form-control form-control-sm" rows="3"></textarea>
                              </div>
                            </div>
                            <div class="tab-pane fade" id="tab-concrete-2" role="tabpanel">
                              <div class="mb-3">
                                <label class="form-label">抽查項目：</label>
                                <span class="form-label-text">外觀（表面整齊，無缺損、無裂縫）</span>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">設計圖、規模之抽查標準（定量定性）：</label>
                                <ul>
                                  <li>彎曲麵以外適當位置以黑色噴漆或凹字方式標示製造廠商名稱或代號_______</li>
                                  <li>標示位置</li>
                                </ul>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">實際抽查情形（敘述抽查值）：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_concrete_2" class="form-check-input"
                                      type="radio" name="situation_concrete_2" id="s1b_2" value="符合" />
                                    <label class="form-check-label" for="s1b_2">符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_concrete_2" class="form-check-input"
                                      type="radio" name="situation_concrete_2" id="s2b_2" value="不符合" />
                                    <label class="form-check-label" for="s2b_2">不符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_concrete_2" class="form-check-input"
                                      type="radio" name="situation_concrete_2" id="s3b_2" value="不回報" />
                                    <label class="form-check-label" for="s3b_2">不回報</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">抽查結果：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_concrete_2" class="form-check-input"
                                      type="radio" name="result_concrete_2" id="r1b_2" value="抽查合格" />
                                    <label class="form-check-label" for="r1b_2">抽查合格</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_concrete_2" class="form-check-input"
                                      type="radio" name="result_concrete_2" id="r2b_2" value="有缺失需改正" />
                                    <label class="form-check-label" for="r2b_2">有缺失需改正</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_concrete_2" class="form-check-input"
                                      type="radio" name="result_concrete_2" id="r3b_2" value="無此抽查項目" />
                                    <label class="form-check-label" for="r3b_2">無此抽查項目</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-0">
                                <label class="form-label">備註：</label>
                                <textarea class="form-control form-control-sm" rows="3"></textarea>
                              </div>
                            </div>
                            <div class="tab-pane fade" id="tab-manhole-2" role="tabpanel">
                              <div class="mb-3">
                                <label class="form-label">抽查項目：</label>
                                <span class="form-label-text">外觀（表面整齊，無缺損、無裂縫）</span>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">設計圖、規模之抽查標準（定量定性）：</label>
                                <ul>
                                  <li>彎曲麵以外適當位置以黑色噴漆或凹字方式標示製造廠商名稱或代號_______</li>
                                  <li>標示位置</li>
                                </ul>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">實際抽查情形（敘述抽查值）：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_manhole_2" class="form-check-input"
                                      type="radio" name="situation_manhole_2" id="s1c_2" value="符合" />
                                    <label class="form-check-label" for="s1c_2">符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_manhole_2" class="form-check-input"
                                      type="radio" name="situation_manhole_2" id="s2c_2" value="不符合" />
                                    <label class="form-check-label" for="s2c_2">不符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_manhole_2" class="form-check-input"
                                      type="radio" name="situation_manhole_2" id="s3c_2" value="不回報" />
                                    <label class="form-check-label" for="s3c_2">不回報</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">抽查結果：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_manhole_2" class="form-check-input" type="radio"
                                      name="result_manhole_2" id="r1c_2" value="抽查合格" />
                                    <label class="form-check-label" for="r1c_2">抽查合格</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_manhole_2" class="form-check-input" type="radio"
                                      name="result_manhole_2" id="r2c_2" value="有缺失需改正" />
                                    <label class="form-check-label" for="r2c_2">有缺失需改正</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_manhole_2" class="form-check-input" type="radio"
                                      name="result_manhole_2" id="r3c_2" value="無此抽查項目" />
                                    <label class="form-check-label" for="r3c_2">無此抽查項目</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-0">
                                <label class="form-label">備註：</label>
                                <textarea class="form-control form-control-sm" rows="3"></textarea>
                              </div>
                            </div>
                            <div class="tab-pane fade" id="tab-handhole-2" role="tabpanel">
                              <div class="mb-3">
                                <label class="form-label">抽查項目：</label>
                                <span class="form-label-text">外觀（表面整齊，無缺損、無裂縫）</span>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">設計圖、規模之抽查標準（定量定性）：</label>
                                <ul>
                                  <li>彎曲麵以外適當位置以黑色噴漆或凹字方式標示製造廠商名稱或代號_______</li>
                                  <li>標示位置</li>
                                </ul>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">實際抽查情形（敘述抽查值）：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_handhole_2" class="form-check-input"
                                      type="radio" name="situation_handhole_2" id="s1d_2" value="符合" />
                                    <label class="form-check-label" for="s1d_2">符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_handhole_2" class="form-check-input"
                                      type="radio" name="situation_handhole_2" id="s2d_2" value="不符合" />
                                    <label class="form-check-label" for="s2d_2">不符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_handhole_2" class="form-check-input"
                                      type="radio" name="situation_handhole_2" id="s3d_2" value="不回報" />
                                    <label class="form-check-label" for="s3d_2">不回報</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">抽查結果：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_handhole_2" class="form-check-input"
                                      type="radio" name="result_handhole_2" id="r1d_2" value="抽查合格" />
                                    <label class="form-check-label" for="r1d_2">抽查合格</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_handhole_2" class="form-check-input"
                                      type="radio" name="result_handhole_2" id="r2d_2" value="有缺失需改正" />
                                    <label class="form-check-label" for="r2d_2">有缺失需改正</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_handhole_2" class="form-check-input"
                                      type="radio" name="result_handhole_2" id="r3d_2" value="無此抽查項目" />
                                    <label class="form-check-label" for="r3d_2">無此抽查項目</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-0">
                                <label class="form-label">備註：</label>
                                <textarea class="form-control form-control-sm" rows="3"></textarea>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row g-3 my-3 signature-area border-top">
                      <div class="row g-3">
                        <div class="col-3 col-md-2 col-lg-1">
                          <label class="form-label">環保督導</label>
                        </div>
                        <div class="col-9 col-md-10 col-lg-2">
                          <select class="form-select form-select-sm">
                            <option value="">—</option>
                            <option value="工環人員" selected>工環人員</option>
                          </select>
                        </div>
                        <div class="col-12 col-lg-9">
                          <input type="text" class="form-control form-control-sm" placeholder="" />
                        </div>
                      </div>
                      <div class="row g-3">
                        <div class="col-3 col-md-2 col-lg-1">
                          <label class="form-label">其他</label>
                        </div>
                        <div class="col-9 col-md-10 col-lg-2">
                          <select class="form-select form-select-sm">
                            <option value="">—</option>
                            <option value="機關取締" selected>機關取締</option>
                          </select>
                        </div>
                        <div class="col-12 col-lg-9">
                          <input type="text" class="form-control form-control-sm" placeholder="" />
                        </div>
                      </div>
                      <div class="row g-3">
                        <div class="col-md-1">
                          <label class="form-label">現場檢驗員簽名</label>
                        </div>
                        <div class="col-md-11">
                          <div class="signature-pad-wrap border rounded bg-white">
                            <canvas ref="canvasRef1" class="signature-pad-canvas" aria-label="簽名板"></canvas>
                            <button type="button" class="btn btn-outline-secondary btn-sm mt-1"
                              @click="clearSignature(1)">清除</button>
                          </div>
                          <p class="sign-note-red small mt-3 mb-1">＊必須親自簽名，並押日期，若為代理人，必須加註"代"</p>
                          <p class="text-muted small mb-0">註：本表須併承攬商同一日之『公共工程施工日誌』陳核後併工作單存查。</p>
                        </div>
                      </div>
                    </div>
                    <div class="row g-4 button-area">
                      <div class="d-flex flex-column gap-3 w-100 d-md-none p-0">
                        <div class="row g-3 justify-content-between align-items-center w-100 p-0">
                          <div class="col-6">
                            <button type="button" class="btn btn-lg btn-cancel w-100">取消</button>
                          </div>
                          <div class="col-6">
                            <button type="button" class="btn btn-lg btn-save w-100">暫存</button>
                          </div>
                          <div class="col-12">
                            <button type="button" class="btn btn-lg btn-upload w-100">上傳</button>
                          </div>
                        </div>
                      </div>
                      <div class="d-none d-md-flex gap-2 justify-content-end">
                        <button type="button" class="btn btn-lg btn-cancel">取消</button>
                        <button type="button" class="btn btn-lg btn-save">暫存</button>
                        <button type="button" class="btn btn-lg btn-upload">上傳</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="accordion-item border-start-0 border-end-0">
              <div class="row">
                <div class="col-8">
                  <h2 class="accordion-header" id="headingThree">
                    <button class="accordion-button accordion-header-custom collapsed" type="button"
                      data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false"
                      aria-controls="collapseThree">
                      <span class="accordion-icon" aria-hidden="true"></span>
                      <span class="accordion-title">工安抽查記錄表</span>
                    </button>
                  </h2>
                </div>
                <div class="col-4 d-flex justify-content-center align-items-center">
                  <!-- 有回報的話，顯示已完成 -->
                  <!-- <span class="badge bg-primary">已完成</span> -->
                </div>
              </div>
              <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree"
                data-bs-parent="#accordionExample">
                <div class="accordion-body">
                  <div>
                    <div class="row g-3 mb-3">
                      <div class="col-md-6 d-flex align-items-center gap-2">
                        <label class="form-label dcis-label dcis-label-fixed mb-0 text-nowrap">工程名稱</label>
                        <input class="form-control" type="text" value="500積點管路 - 部分款" aria-label="工程名稱" disabled />
                      </div>
                      <div class="col-md-3 d-flex align-items-center gap-2">
                        <label class="form-label dcis-label dcis-label-fixed mb-0 text-nowrap">DSIC號碼</label>
                        <input class="form-control" type="text" value="5180004" aria-label="DSIC號碼" disabled />
                      </div>
                      <div class="col-md-3 d-flex align-items-center gap-2">
                        <label class="form-label dcis-label dcis-label-fixed mb-0 text-nowrap">承包商</label>
                        <input class="form-control" type="text" value="" aria-label="承包商" />
                      </div>
                    </div>
                    <div class="row g-3 mb-4">
                      <div class="col-md-3 d-flex align-items-center gap-2">
                        <label class="form-label dcis-label dcis-label-fixed mb-0 text-nowrap">抽查地點</label>
                        <input class="form-control" type="text" value="原街" aria-label="抽查地點" />
                      </div>
                      <div class="col-md-3 d-flex align-items-center gap-2">
                        <label class="form-label dcis-label dcis-label-fixed mb-0 text-nowrap">抽查日期</label>
                        <input type="date" class="form-control form-control-sm" />
                      </div>
                      <div class="col-md-3 d-flex align-items-center gap-2">
                        <label class="form-label dcis-label dcis-label-fixed mb-0 text-nowrap">抽查時機</label>
                        <select class="form-select form-select-sm" aria-label="抽查時機">
                          <option value="施工前抽查" selected>施工前抽查</option>
                          <option value="施工中抽查">施工中抽查</option>
                          <option value="施工後抽查">施工後抽查</option>
                        </select>
                      </div>
                    </div>
                    <div class="mb-3 category-nav-tabs">
                      <p class="form-category-title mb-0 mb-md-3 py-2 text-center">類別</p>
                      <div class="category-mobile-accordion d-lg-none accordion" id="categoryAccordion3">
                        <div class="accordion-item category-mobile-item border-0">
                          <h3 class="accordion-header">
                            <button class="accordion-button category-mobile-nav collapsed py-3" type="button"
                              data-bs-toggle="collapse" data-bs-target="#cat3-plastic" aria-expanded="false"
                              aria-controls="cat3-plastic">塑膠硬管及配件類<i
                                class="bi bi-caret-right-fill category-mobile-caret" aria-hidden="true"></i></button>
                          </h3>
                          <div id="cat3-plastic" class="accordion-collapse collapse"
                            data-bs-parent="#categoryAccordion3">
                            <div class="accordion-body p-3 category-mobile-pane">
                              <div class="mb-3"><label class="form-label">抽查項目：</label><span
                                  class="form-label-text">外觀（表面整齊，無缺損、無裂縫）</span></div>
                              <div class="mb-3"><label class="form-label">設計圖、規模之抽查標準（定量定性）：</label>
                                <ul>
                                  <li>彎曲麵以外適當位置以黑色噴漆或凹字方式標示製造廠商名稱或代號_______</li>
                                  <li>標示位置</li>
                                </ul>
                              </div>
                              <div class="mb-3"><label class="form-label">實際抽查情形（敘述抽查值）：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"
                                      v-model="categoryForm.situation_plastic_3" name="situation_plastic_3_m"
                                      id="s1a-m3" value="符合" /><label class="form-check-label" for="s1a-m3">符合</label>
                                  </div>
                                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"
                                      v-model="categoryForm.situation_plastic_3" name="situation_plastic_3_m"
                                      id="s2a-m3" value="不符合" /><label class="form-check-label" for="s2a-m3">不符合</label>
                                  </div>
                                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"
                                      v-model="categoryForm.situation_plastic_3" name="situation_plastic_3_m"
                                      id="s3a-m3" value="不回報" /><label class="form-check-label" for="s3a-m3">不回報</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-3"><label class="form-label">抽查結果：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"
                                      v-model="categoryForm.result_plastic_3" name="result_plastic_3_m" id="r1a-m3"
                                      value="抽查合格" /><label class="form-check-label" for="r1a-m3">抽查合格</label></div>
                                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"
                                      v-model="categoryForm.result_plastic_3" name="result_plastic_3_m" id="r2a-m3"
                                      value="有缺失需改正" /><label class="form-check-label" for="r2a-m3">有缺失需改正</label></div>
                                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"
                                      v-model="categoryForm.result_plastic_3" name="result_plastic_3_m" id="r3a-m3"
                                      value="無此抽查項目" /><label class="form-check-label" for="r3a-m3">無此抽查項目</label></div>
                                </div>
                              </div>
                              <div class="mb-0"><label class="form-label">備註：</label><textarea
                                  class="form-control form-control-sm" rows="3"></textarea></div>
                            </div>
                          </div>
                        </div>
                        <div class="accordion-item category-mobile-item border-0 rounded-0">
                          <h3 class="accordion-header">
                            <button class="accordion-button category-mobile-nav collapsed py-3" type="button"
                              data-bs-toggle="collapse" data-bs-target="#cat3-concrete" aria-expanded="false"
                              aria-controls="cat3-concrete">混凝土管路隔離版<i
                                class="bi bi-caret-right-fill category-mobile-caret" aria-hidden="true"></i></button>
                          </h3>
                          <div id="cat3-concrete" class="accordion-collapse collapse"
                            data-bs-parent="#categoryAccordion3">
                            <div class="accordion-body p-3 category-mobile-pane">
                              <div class="mb-3"><label class="form-label">抽查項目：</label><span
                                  class="form-label-text">外觀（表面整齊，無缺損、無裂縫）</span></div>
                              <div class="mb-3"><label class="form-label">設計圖、規模之抽查標準（定量定性）：</label>
                                <ul>
                                  <li>彎曲麵以外適當位置以黑色噴漆或凹字方式標示製造廠商名稱或代號_______</li>
                                  <li>標示位置</li>
                                </ul>
                              </div>
                              <div class="mb-3"><label class="form-label">實際抽查情形（敘述抽查值）：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"
                                      v-model="categoryForm.situation_concrete_3" name="situation_concrete_3_m"
                                      id="s1b-m3" value="符合" /><label class="form-check-label" for="s1b-m3">符合</label>
                                  </div>
                                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"
                                      v-model="categoryForm.situation_concrete_3" name="situation_concrete_3_m"
                                      id="s2b-m3" value="不符合" /><label class="form-check-label" for="s2b-m3">不符合</label>
                                  </div>
                                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"
                                      v-model="categoryForm.situation_concrete_3" name="situation_concrete_3_m"
                                      id="s3b-m3" value="不回報" /><label class="form-check-label" for="s3b-m3">不回報</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-3"><label class="form-label">抽查結果：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"
                                      v-model="categoryForm.result_concrete_3" name="result_concrete_3_m" id="r1b-m3"
                                      value="抽查合格" /><label class="form-check-label" for="r1b-m3">抽查合格</label></div>
                                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"
                                      v-model="categoryForm.result_concrete_3" name="result_concrete_3_m" id="r2b-m3"
                                      value="有缺失需改正" /><label class="form-check-label" for="r2b-m3">有缺失需改正</label></div>
                                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"
                                      v-model="categoryForm.result_concrete_3" name="result_concrete_3_m" id="r3b-m3"
                                      value="無此抽查項目" /><label class="form-check-label" for="r3b-m3">無此抽查項目</label></div>
                                </div>
                              </div>
                              <div class="mb-0"><label class="form-label">備註：</label><textarea
                                  class="form-control form-control-sm" rows="3"></textarea></div>
                            </div>
                          </div>
                        </div>
                        <div class="accordion-item category-mobile-item border-0 rounded-0">
                          <h3 class="accordion-header">
                            <button class="accordion-button category-mobile-nav collapsed py-3" type="button"
                              data-bs-toggle="collapse" data-bs-target="#cat3-manhole" aria-expanded="false"
                              aria-controls="cat3-manhole">預鑄人孔<i class="bi bi-caret-right-fill category-mobile-caret"
                                aria-hidden="true"></i></button>
                          </h3>
                          <div id="cat3-manhole" class="accordion-collapse collapse"
                            data-bs-parent="#categoryAccordion3">
                            <div class="accordion-body p-3 category-mobile-pane">
                              <div class="mb-3"><label class="form-label">抽查項目：</label><span
                                  class="form-label-text">外觀（表面整齊，無缺損、無裂縫）</span></div>
                              <div class="mb-3"><label class="form-label">設計圖、規模之抽查標準（定量定性）：</label>
                                <ul>
                                  <li>彎曲麵以外適當位置以黑色噴漆或凹字方式標示製造廠商名稱或代號_______</li>
                                  <li>標示位置</li>
                                </ul>
                              </div>
                              <div class="mb-3"><label class="form-label">實際抽查情形（敘述抽查值）：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"
                                      v-model="categoryForm.situation_manhole_3" name="situation_manhole_3_m"
                                      id="s1c-m3" value="符合" /><label class="form-check-label" for="s1c-m3">符合</label>
                                  </div>
                                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"
                                      v-model="categoryForm.situation_manhole_3" name="situation_manhole_3_m"
                                      id="s2c-m3" value="不符合" /><label class="form-check-label" for="s2c-m3">不符合</label>
                                  </div>
                                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"
                                      v-model="categoryForm.situation_manhole_3" name="situation_manhole_3_m"
                                      id="s3c-m3" value="不回報" /><label class="form-check-label" for="s3c-m3">不回報</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-3"><label class="form-label">抽查結果：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"
                                      v-model="categoryForm.result_manhole_3" name="result_manhole_3_m" id="r1c-m3"
                                      value="抽查合格" /><label class="form-check-label" for="r1c-m3">抽查合格</label></div>
                                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"
                                      v-model="categoryForm.result_manhole_3" name="result_manhole_3_m" id="r2c-m3"
                                      value="有缺失需改正" /><label class="form-check-label" for="r2c-m3">有缺失需改正</label></div>
                                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"
                                      v-model="categoryForm.result_manhole_3" name="result_manhole_3_m" id="r3c-m3"
                                      value="無此抽查項目" /><label class="form-check-label" for="r3c-m3">無此抽查項目</label></div>
                                </div>
                              </div>
                              <div class="mb-0"><label class="form-label">備註：</label><textarea
                                  class="form-control form-control-sm" rows="3"></textarea></div>
                            </div>
                          </div>
                        </div>
                        <div class="accordion-item category-mobile-item border-0 rounded-0">
                          <h3 class="accordion-header">
                            <button class="accordion-button category-mobile-nav collapsed py-3" type="button"
                              data-bs-toggle="collapse" data-bs-target="#cat3-handhole" aria-expanded="false"
                              aria-controls="cat3-handhole">預鑄手孔<i class="bi bi-caret-right-fill category-mobile-caret"
                                aria-hidden="true"></i></button>
                          </h3>
                          <div id="cat3-handhole" class="accordion-collapse collapse"
                            data-bs-parent="#categoryAccordion3">
                            <div class="accordion-body p-3 category-mobile-pane">
                              <div class="mb-3"><label class="form-label">抽查項目：</label><span
                                  class="form-label-text">外觀（表面整齊，無缺損、無裂縫）</span></div>
                              <div class="mb-3"><label class="form-label">設計圖、規模之抽查標準（定量定性）：</label>
                                <ul>
                                  <li>彎曲麵以外適當位置以黑色噴漆或凹字方式標示製造廠商名稱或代號_______</li>
                                  <li>標示位置</li>
                                </ul>
                              </div>
                              <div class="mb-3"><label class="form-label">實際抽查情形（敘述抽查值）：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"
                                      v-model="categoryForm.situation_handhole_3" name="situation_handhole_3_m"
                                      id="s1d-m3" value="符合" /><label class="form-check-label" for="s1d-m3">符合</label>
                                  </div>
                                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"
                                      v-model="categoryForm.situation_handhole_3" name="situation_handhole_3_m"
                                      id="s2d-m3" value="不符合" /><label class="form-check-label" for="s2d-m3">不符合</label>
                                  </div>
                                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"
                                      v-model="categoryForm.situation_handhole_3" name="situation_handhole_3_m"
                                      id="s3d-m3" value="不回報" /><label class="form-check-label" for="s3d-m3">不回報</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-3"><label class="form-label">抽查結果：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"
                                      v-model="categoryForm.result_handhole_3" name="result_handhole_3_m" id="r1d-m3"
                                      value="抽查合格" /><label class="form-check-label" for="r1d-m3">抽查合格</label></div>
                                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"
                                      v-model="categoryForm.result_handhole_3" name="result_handhole_3_m" id="r2d-m3"
                                      value="有缺失需改正" /><label class="form-check-label" for="r2d-m3">有缺失需改正</label></div>
                                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"
                                      v-model="categoryForm.result_handhole_3" name="result_handhole_3_m" id="r3d-m3"
                                      value="無此抽查項目" /><label class="form-check-label" for="r3d-m3">無此抽查項目</label></div>
                                </div>
                              </div>
                              <div class="mb-0"><label class="form-label">備註：</label><textarea
                                  class="form-control form-control-sm" rows="3"></textarea></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row gx-5 d-none d-lg-flex">
                        <div class="col-lg-3">
                          <nav class="nav flex-column category-nav border-0 shadow-none" role="tablist">
                            <button class="nav-link form-category-item active" type="button" role="tab"
                              data-bs-toggle="tab" data-bs-target="#tab-plastic-3" aria-selected="true"
                              aria-controls="tab-plastic-3">塑膠硬管及配件類</button>
                            <button class="nav-link form-category-item" type="button" role="tab" data-bs-toggle="tab"
                              data-bs-target="#tab-concrete-3" aria-selected="false"
                              aria-controls="tab-concrete-3">混凝土管路隔離版</button>
                            <button class="nav-link form-category-item" type="button" role="tab" data-bs-toggle="tab"
                              data-bs-target="#tab-manhole-3" aria-selected="false"
                              aria-controls="tab-manhole-3">預鑄人孔</button>
                            <button class="nav-link form-category-item" type="button" role="tab" data-bs-toggle="tab"
                              data-bs-target="#tab-handhole-3" aria-selected="false"
                              aria-controls="tab-handhole-3">預鑄手孔</button>
                          </nav>
                        </div>
                        <div class="col-lg-9 tab-content-wrapper ps-0 border-0 shadow-none">
                          <div class="tab-content p-3" id="categoryTabContent3">
                            <div class="tab-pane fade show active" id="tab-plastic-3" role="tabpanel">
                              <div class="mb-3">
                                <label class="form-label">抽查項目：</label>
                                <span class="form-label-text">外觀（表面整齊，無缺損、無裂縫）</span>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">設計圖、規模之抽查標準（定量定性）：</label>
                                <ul>
                                  <li>彎曲麵以外適當位置以黑色噴漆或凹字方式標示製造廠商名稱或代號_______</li>
                                  <li>標示位置</li>
                                </ul>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">實際抽查情形（敘述抽查值）：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_plastic_3" class="form-check-input"
                                      type="radio" name="situation_plastic_3" id="s1a_3" value="符合" />
                                    <label class="form-check-label" for="s1a_3">符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_plastic_3" class="form-check-input"
                                      type="radio" name="situation_plastic_3" id="s2a_3" value="不符合" />
                                    <label class="form-check-label" for="s2a_3">不符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_plastic_3" class="form-check-input"
                                      type="radio" name="situation_plastic_3" id="s3a_3" value="不回報" />
                                    <label class="form-check-label" for="s3a_3">不回報</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">抽查結果：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_plastic_3" class="form-check-input" type="radio"
                                      name="result_plastic_3" id="r1a_3" value="抽查合格" />
                                    <label class="form-check-label" for="r1a_3">抽查合格</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_plastic_3" class="form-check-input" type="radio"
                                      name="result_plastic_3" id="r2a_3" value="有缺失需改正" />
                                    <label class="form-check-label" for="r2a_3">有缺失需改正</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_plastic_3" class="form-check-input" type="radio"
                                      name="result_plastic_3" id="r3a_3" value="無此抽查項目" />
                                    <label class="form-check-label" for="r3a_3">無此抽查項目</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-0">
                                <label class="form-label">備註：</label>
                                <textarea class="form-control form-control-sm" rows="3"></textarea>
                              </div>
                            </div>
                            <div class="tab-pane fade" id="tab-concrete-3" role="tabpanel">
                              <div class="mb-3">
                                <label class="form-label">抽查項目：</label>
                                <span class="form-label-text">外觀（表面整齊，無缺損、無裂縫）</span>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">設計圖、規模之抽查標準（定量定性）：</label>
                                <ul>
                                  <li>彎曲麵以外適當位置以黑色噴漆或凹字方式標示製造廠商名稱或代號_______</li>
                                  <li>標示位置</li>
                                </ul>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">實際抽查情形（敘述抽查值）：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_concrete_3" class="form-check-input"
                                      type="radio" name="situation_concrete_3" id="s1b_3" value="符合" />
                                    <label class="form-check-label" for="s1b_3">符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_concrete_3" class="form-check-input"
                                      type="radio" name="situation_concrete_3" id="s2b_3" value="不符合" />
                                    <label class="form-check-label" for="s2b_3">不符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_concrete_3" class="form-check-input"
                                      type="radio" name="situation_concrete_3" id="s3b_3" value="不回報" />
                                    <label class="form-check-label" for="s3b_3">不回報</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">抽查結果：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_concrete_3" class="form-check-input"
                                      type="radio" name="result_concrete_3" id="r1b_3" value="抽查合格" />
                                    <label class="form-check-label" for="r1b_3">抽查合格</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_concrete_3" class="form-check-input"
                                      type="radio" name="result_concrete_3" id="r2b_3" value="有缺失需改正" />
                                    <label class="form-check-label" for="r2b_3">有缺失需改正</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_concrete_3" class="form-check-input"
                                      type="radio" name="result_concrete_3" id="r3b_3" value="無此抽查項目" />
                                    <label class="form-check-label" for="r3b_3">無此抽查項目</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-0">
                                <label class="form-label">備註：</label>
                                <textarea class="form-control form-control-sm" rows="3"></textarea>
                              </div>
                            </div>
                            <div class="tab-pane fade" id="tab-manhole-3" role="tabpanel">
                              <div class="mb-3">
                                <label class="form-label">抽查項目：</label>
                                <span class="form-label-text">外觀（表面整齊，無缺損、無裂縫）</span>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">設計圖、規模之抽查標準（定量定性）：</label>
                                <ul>
                                  <li>彎曲麵以外適當位置以黑色噴漆或凹字方式標示製造廠商名稱或代號_______</li>
                                  <li>標示位置</li>
                                </ul>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">實際抽查情形（敘述抽查值）：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_manhole_3" class="form-check-input"
                                      type="radio" name="situation_manhole_3" id="s1c_3" value="符合" />
                                    <label class="form-check-label" for="s1c_3">符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_manhole_3" class="form-check-input"
                                      type="radio" name="situation_manhole_3" id="s2c_3" value="不符合" />
                                    <label class="form-check-label" for="s2c_3">不符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_manhole_3" class="form-check-input"
                                      type="radio" name="situation_manhole_3" id="s3c_3" value="不回報" />
                                    <label class="form-check-label" for="s3c_3">不回報</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">抽查結果：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_manhole_3" class="form-check-input" type="radio"
                                      name="result_manhole_3" id="r1c_3" value="抽查合格" />
                                    <label class="form-check-label" for="r1c_3">抽查合格</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_manhole_3" class="form-check-input" type="radio"
                                      name="result_manhole_3" id="r2c_3" value="有缺失需改正" />
                                    <label class="form-check-label" for="r2c_3">有缺失需改正</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_manhole_3" class="form-check-input" type="radio"
                                      name="result_manhole_3" id="r3c_3" value="無此抽查項目" />
                                    <label class="form-check-label" for="r3c_3">無此抽查項目</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-0">
                                <label class="form-label">備註：</label>
                                <textarea class="form-control form-control-sm" rows="3"></textarea>
                              </div>
                            </div>
                            <div class="tab-pane fade" id="tab-handhole-3" role="tabpanel">
                              <div class="mb-3">
                                <label class="form-label">抽查項目：</label>
                                <span class="form-label-text">外觀（表面整齊，無缺損、無裂縫）</span>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">設計圖、規模之抽查標準（定量定性）：</label>
                                <ul>
                                  <li>彎曲麵以外適當位置以黑色噴漆或凹字方式標示製造廠商名稱或代號_______</li>
                                  <li>標示位置</li>
                                </ul>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">實際抽查情形（敘述抽查值）：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_handhole_3" class="form-check-input"
                                      type="radio" name="situation_handhole_3" id="s1d_3" value="符合" />
                                    <label class="form-check-label" for="s1d_3">符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_handhole_3" class="form-check-input"
                                      type="radio" name="situation_handhole_3" id="s2d_3" value="不符合" />
                                    <label class="form-check-label" for="s2d_3">不符合</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.situation_handhole_3" class="form-check-input"
                                      type="radio" name="situation_handhole_3" id="s3d_3" value="不回報" />
                                    <label class="form-check-label" for="s3d_3">不回報</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-3">
                                <label class="form-label">抽查結果：</label>
                                <div class="d-flex flex-wrap gap-3">
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_handhole_3" class="form-check-input"
                                      type="radio" name="result_handhole_3" id="r1d_3" value="抽查合格" />
                                    <label class="form-check-label" for="r1d_3">抽查合格</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_handhole_3" class="form-check-input"
                                      type="radio" name="result_handhole_3" id="r2d_3" value="有缺失需改正" />
                                    <label class="form-check-label" for="r2d_3">有缺失需改正</label>
                                  </div>
                                  <div class="form-check form-check-inline">
                                    <input v-model="categoryForm.result_handhole_3" class="form-check-input"
                                      type="radio" name="result_handhole_3" id="r3d_3" value="無此抽查項目" />
                                    <label class="form-check-label" for="r3d_3">無此抽查項目</label>
                                  </div>
                                </div>
                              </div>
                              <div class="mb-0">
                                <label class="form-label">備註：</label>
                                <textarea class="form-control form-control-sm" rows="3"></textarea>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row g-3 my-3 signature-area border-top">
                      <div class="row g-3">
                        <div class="col-3 col-md-2 col-lg-1">
                          <label class="form-label">環保督導</label>
                        </div>
                        <div class="col-9 col-md-10 col-lg-2">
                          <select class="form-select form-select-sm">
                            <option value="">—</option>
                            <option value="工環人員" selected>工環人員</option>
                          </select>
                        </div>
                        <div class="col-12 col-lg-9">
                          <input type="text" class="form-control form-control-sm" placeholder="" />
                        </div>
                      </div>
                      <div class="row g-3">
                        <div class="col-3 col-md-2 col-lg-1">
                          <label class="form-label">其他</label>
                        </div>
                        <div class="col-9 col-md-10 col-lg-2">
                          <select class="form-select form-select-sm">
                            <option value="">—</option>
                            <option value="機關取締" selected>機關取締</option>
                          </select>
                        </div>
                        <div class="col-12 col-lg-9">
                          <input type="text" class="form-control form-control-sm" placeholder="" />
                        </div>
                      </div>
                      <div class="row g-3">
                        <div class="col-md-1">
                          <label class="form-label">現場檢驗員簽名</label>
                        </div>
                        <div class="col-md-11">
                          <div class="signature-pad-wrap border rounded bg-white">
                            <canvas ref="canvasRef2" class="signature-pad-canvas" aria-label="簽名板"></canvas>
                            <button type="button" class="btn btn-outline-secondary btn-sm mt-1"
                              @click="clearSignature(2)">清除</button>
                          </div>
                          <p class="sign-note-red small mt-3 mb-1">＊必須親自簽名，並押日期，若為代理人，必須加註"代"</p>
                          <p class="text-muted small mb-0">註：本表須併承攬商同一日之『公共工程施工日誌』陳核後併工作單存查。</p>
                        </div>
                      </div>
                    </div>
                    <div class="row g-4 button-area">
                      <div class="d-flex flex-column gap-3 w-100 d-md-none p-0">
                        <div class="row g-3 justify-content-between align-items-center w-100 p-0">
                          <div class="col-6">
                            <button type="button" class="btn btn-lg btn-cancel w-100">取消</button>
                          </div>
                          <div class="col-6">
                            <button type="button" class="btn btn-lg btn-save w-100">暫存</button>
                          </div>
                          <div class="col-12">
                            <button type="button" class="btn btn-lg btn-upload w-100">上傳</button>
                          </div>
                        </div>
                      </div>
                      <div class="d-none d-md-flex gap-2 justify-content-end">
                        <button type="button" class="btn btn-lg btn-cancel">取消</button>
                        <button type="button" class="btn btn-lg btn-save">暫存</button>
                        <button type="button" class="btn btn-lg btn-upload">上傳</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer pb-3 bg-white border-0">
          <div class="card-footer-title pb-3 border-3 border-bottom border-primary">
            <span class="">完成抽查</span>
          </div>
        </div>
        <div class="text-center text-muted small mt-5 mb-3">系統版本：240322.01T</div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.desktop-layout {
  min-height: 100vh;
  background: var(--color-page-bg);
  /* 不在外層設 overflow，否則內部 header 的 sticky-top 會失效 */
}

/* 僅手機/平板（< lg）時 header 使用 sticky；桌面版隨頁面捲動 */
.header.header-sticky-mobile {
  position: relative;
}
@media (max-width: 991.98px) {
  .header.header-sticky-mobile {
    position: sticky;
    top: 0;
    z-index: 1020;
  }
  /* 回報狀態項目列：黏在 header 下方，top 對齊 header 高度 */
  .sticky-row-mobile {
    position: sticky;
    top: 7rem; /* 約等於 header（navbar + 標題列）高度 */
    /* margin: 0 -8px; */
    z-index: 1019;
    background: #fff;
  }
}

.back-link {
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 600;
}

.back-link-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background-color: #383d78;
  color: #fff;
  border-radius: 0.375rem;
  font-size: 1.25rem;
  line-height: 1;
  flex-shrink: 0;
}

.back-link-text {
  color: #20c997;
}

.back-link:hover .back-link-text {
  color: #20c997;
  /* text-decoration: underline; */
}

/* 回報項目下方：DCIS、施工號碼（僅平板/手機顯示，對齊回報項目文字） */
.back-link-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem 0.75rem;
  font-size: 0.9375rem;
  color: var(--color-greyish-brown);
  margin-left: 2.5rem;
  /* 與回報項目文字對齊：icon 2rem + gap-2 0.5rem */
}

.back-link-meta-label {
  color: var(--color-teal);
}

.back-link-meta-sep {
  color: var(--color-brownish-grey);
  user-select: none;
}

.header-title {
  /* margin: 0 auto; */
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-sf-dblue);
}

.user-name,
.user-role {
  font-size: 0.875rem;
  color: var(--color-greyish-brown);
}

.user-role.small {
  font-size: 0.75rem;
}

.avatar {
  width: 44px;
  height: 44px;
  font-size: 1.25rem;
}

/* Navbar：避免 collapse 擠壓或蓋住 brand */
.header .container-fluid {
  display: flex;
  align-items: center;
  overflow: hidden;
  min-width: 0;
}

.header-brand {
  flex-shrink: 0;
  position: relative;
  z-index: 2;
}

.header .navbar-toggler {
  flex-shrink: 0;
  position: relative;
  z-index: 2;
}

/* 桌面 navbar 標題區可縮小、標題過長省略 */
.header .min-width-0 {
  min-width: 0;
}

.header .d-lg-flex .header-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Offcanvas 內按鈕：全寬、圖示+文字 */
#navbarOffcanvas .header-actions .btn {
  justify-content: flex-start;
  padding-left: 1rem;
  padding-right: 1rem;
}

/* Navbar 品牌區（左側深藍） */
.header-brand {
  background: var(--color-sidebar);
  color: #fff;
  padding: 0.5rem 1rem;
  /* margin: 0 -0.5rem 0 0; */
  border-radius: 0;
}

.header-brand:hover {
  color: #fff;
  opacity: 0.95;
}

.header-brand-logo {
  width: 2.5rem;
  height: 2.5rem;
  min-width: 2.5rem;
  object-fit: contain;
  display: block;
}

.header-brand-text {
  font-weight: 600;
  white-space: nowrap;
}

/* 右側圖示按鈕（深藍方塊） */
.btn-header-icon {
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  background: var(--color-sidebar);
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-header-icon:hover {
  background: var(--color-sf-dblue);
  color: #fff;
}

.btn-header-icon .bi {
  font-size: 1.1rem;
}

.card-label,
.dcis-label {
  font-weight: 500;
  color: var(--color-teal);
}

.dcis-label-fixed {
  width: 5em;
  min-width: 5em;
  flex-shrink: 0;
}

/* 類別區塊：左 nav、右 tabs */
.category-nav-tabs .form-category-title {
  font-weight: 600;
  color: #fff;
  background: var(--color-teal);
  border-radius: 4px 4px 0 0;
}

.category-nav {
  border: 1px solid var(--color-border);
  border-top: none;
  border-radius: 0 0 4px 4px;
}

.category-nav .form-category-item {
  text-align: left;
  color: var(--color-brownish-grey);
  background: #fff;
  border: none;
  border-bottom: 1px solid var(--color-border);
  border-radius: 0;
  padding: 0.5rem 0.75rem;
  position: relative;
}

.category-nav .form-category-item:last-child {
  border-bottom: none;
}

.category-nav .form-category-item::after {
  content: '';
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-left: 5px solid var(--color-brownish-grey);
}

.category-nav .form-category-item.active {
  color: var(--color-cool-blue);
}

.category-nav .form-category-item.active::after {
  border-left-color: var(--color-cool-blue);
  transform: translateY(-50%) rotate(90deg);
}

.category-nav .form-category-item:hover {
  background: #fff;
  color: var(--color-cool-blue);
}

.category-nav .form-category-item.active:hover {
  background: #fff;
  color: var(--color-cool-blue);
}

.category-nav .form-category-item:focus {
  box-shadow: none;
  outline: none;
}

.tab-content-wrapper {
  border: 1px solid var(--color-border);
  border-radius: 4px;
  /* background: #fff; */
}

.tab-content {
  background: #fff;
}
/* 平板/手機：類別 nav 在點擊處下方展開，樣式如圖（深藍／亮藍＋chevron） */
.category-mobile-accordion.accordion {
  /* border: 1px solid var(--color-border); */
  border-top: none;
  border-radius: 0 0 4px 4px;
  overflow: hidden;
}

.category-mobile-accordion .category-mobile-item {
  margin-top: 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 5px;
}

.category-mobile-accordion .category-mobile-item:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.category-mobile-nav {
  background: #262d6a !important;
  color: #fff !important;
  font-weight: 600;
  border: none;
  box-shadow: none;
  border-radius: 5px;
}

.category-mobile-nav:not(.collapsed) {
  background: #00a2d9 !important;
  color: #fff !important;
}

.category-mobile-accordion .accordion-button::after {
  display: none;
}

.category-mobile-accordion .category-mobile-caret {
  color: #fff;
  font-size: 0.75rem;
  margin-left: auto;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.category-mobile-accordion .accordion-button:not(.collapsed) .category-mobile-caret {
  transform: rotate(90deg);
}

.category-mobile-pane {
  background: #fff;
  border-top: 1px solid var(--color-border);
}

.signature-pad-wrap {
  max-width: 100%;
  overflow: hidden;
}

.signature-pad-canvas {
  display: block;
  width: 100%;
  height: 200px;
  touch-action: none;
}

.sign-note-red {
  color: var(--color-red);
}

.btn-save {
  background: var(--color-teal);
  color: #fff;
  border-color: var(--color-teal);
}

.btn-save:hover {
  background: #6bc4c0;
  color: #fff;
  border-color: #6bc4c0;
}

.btn-upload {
  background: var(--color-btn-upload);
  color: #fff;
  border-color: var(--color-btn-upload);
}

.btn-upload:hover {
  filter: brightness(1.1);
  color: #fff;
}

.btn-cancel {
  background: var(--color-btn-cancel);
  color: #fff;
  border-color: var(--color-btn-cancel);
}

.btn-cancel:hover {
  filter: brightness(1.1);
  color: #fff;
}

/* Accordion 自訂：左 teal 圖示、標題文字、無 focus、上方分隔線 */
.accordion-custom .accordion-item {
  background: #fff;
  /* margin-top: .5rem; */
}

.accordion-custom .accordion-header {
  border-top: 1px solid var(--color-border);
}

.accordion-custom .accordion-button.accordion-header-custom {
  background: #fff;
  color: #000;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: none;
  box-shadow: none;
  outline: none;
}

.accordion-custom .accordion-button.accordion-header-custom:hover {
  background: #fff;
  color: #000;
}

.accordion-custom .accordion-button.accordion-header-custom:focus,
.accordion-custom .accordion-button.accordion-header-custom:focus-visible {
  box-shadow: none;
  outline: none;
  border: none;
}

.accordion-custom .accordion-button.accordion-header-custom::after {
  display: none;
}

.accordion-icon {
  width: 1.5rem;
  height: 1.5rem;
  min-width: 1.5rem;
  background: var(--color-teal);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  /* 白色右箭頭 (收合) */
  position: relative;
}

.accordion-icon::after {
  content: '';
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 6px solid #fff;
  margin-left: 2px;
  transition: transform 0.2s ease;
}

.accordion-custom .accordion-button.accordion-header-custom:not(.collapsed) .accordion-icon::after {
  transform: rotate(90deg);
  margin-left: 0;
  margin-top: 2px;
}

.accordion-title {
  flex: 1;
  text-align: left;
  font-weight: 400;
}

/* 展開時標題與 form-label 同色（Bootstrap body 色） */
.accordion-custom .accordion-button.accordion-header-custom[aria-expanded="true"] .accordion-title {
  color: var(--color-teal, #212529);
  font-weight: 600;
}

.accordion-custom .accordion-button.accordion-header-custom[aria-expanded="false"] .accordion-title {
  color: var(--color-sf-dblue);
  font-weight: 600;
}

.accordion-collapse {
  color: var(--color-sf-dblue);
}

.accordion-body {
  background: var(--color-page-bg);
}

.accordion-custom .form-label {
  color: var(--color-sf-dblue);
  font-weight: 600;
}

.tab-content .form-label {
  color: var(--color-teal);
}

/* 類別手機 accordion 展開區的 label 使用 teal，優先於 .accordion-custom .form-label */
.category-mobile-pane .form-label {
  color: var(--color-teal);
}

/* ========== RWD：平板、手機 ========== */
@media (max-width: 991.98px) {

  /* 平板/手機：整條 header 藍底，漢堡圖示改白色 */
  .header,
  .header .navbar {
    background: var(--color-sidebar) !important;
  }

  .header {
    border-bottom-color: rgba(255, 255, 255, 0.15);
  }

  .header .navbar-toggler {
    color: rgba(255, 255, 255, 0.9);
  }

  .header .navbar-toggler-icon {
    filter: brightness(0) invert(1);
  }

  .header .header-brand {
    background: transparent;
  }

  .navbar-collapse {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }

  .navbar-collapse .header-title {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    text-align: center;
    margin-right: 0;
  }

  .navbar-collapse .d-flex.align-items-center.gap-3 {
    flex-wrap: wrap;
    justify-content: center;
  }

  .main.container {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  /* DCIS 地點：平板/手機時 input 單獨一行 */
  .dcis-location-row {
    flex-wrap: wrap;
  }

  .dcis-location-row .form-control {
    flex: 0 0 100%;
    max-width: 100%;
  }

  /* 類別區：小螢幕改橫向 nav + 下方 tab */
  .category-nav-tabs {
    flex-direction: column;
  }

  .category-nav-tabs .category-nav {
    flex-direction: row;
    flex-wrap: wrap;
    border-radius: 4px;
    border: 1px solid var(--color-border);
    border-top: none;
    padding: 0.25rem;
    gap: 0.25rem;
  }

  .category-nav-tabs .form-category-title {
    border-radius: 5px;
  }

  .category-nav .form-category-item {
    flex: 1 1 auto;
    min-width: 0;
    border-bottom: none;
    padding: 0.4rem 0.5rem;
    font-size: 0.875rem;
  }

  .category-nav .form-category-item::after {
    display: none;
  }

  .tab-content-wrapper {
    border-radius: 4px;
  }

  .accordion-custom .accordion-button.accordion-header-custom {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }

  .accordion-title {
    font-size: 0.9rem;
  }
}

@media (max-width: 767.98px) {
  .header .navbar {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }

  .navbar-collapse .header-title {
    font-size: 1rem;
  }

  .back-link {
    font-size: 1.25rem;
  }

  /* 表單欄位與簽名區：小螢幕一律全寬堆疊 */
  .accordion-body .row [class*="col-md"],
  .card-body .row [class*="col-md"],
  .signature-area .row [class*="col-md"] {
    /* flex: 0 0 100%; */
    /* max-width: 100%; */
  }

  .signature-area .row.g-3 {
    margin-left: 0;
    margin-right: 0;
  }

  .signature-area .col-md-11 {
    padding-left: 0;
    padding-right: 0;
  }

  .button-area .d-flex {
    flex-wrap: wrap;
    justify-content: stretch;
  }

  .button-area .btn-lg {
    flex: 1 1 100%;
  }

  /* 手機版：取消與暫存同一列並填滿，上傳獨立一列 */
  .button-area .d-md-none .d-flex.gap-2 .btn-lg {
    flex: 1 1 0;
    min-width: 0;
  }

  .dcis-label-fixed {
    min-width: 4em;
    width: 4em;
  }
}

@media (max-width: 575.98px) {
  .main.container {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  .category-nav .form-category-item {
    flex: 1 1 100%;
  }
}
</style>
