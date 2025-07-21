/*
 * This file serves as a collection point for external JS and CSS dependencies.
 * It amalgamates these external resources for easier injection into the application.
 * Additionally, you can directly include any script files in this file
 * that you wish to attach to the application.
 */
console.log(
    '%cbuild from PakePlus： https://github.com/Sjj1024/PakePlus',
    'color:orangered;font-weight:bolder'
)

document.addEventListener('DOMContentLoaded', () => {
    const originalWindowOpen = window.open
    window.open = function (url, _, features) {
        return originalWindowOpen.call(window, url, '_self', features)
    }
    console.log('window.open has been overridden to open in the current page.')
})

document.addEventListener('DOMContentLoaded', () => {
    const targetNode = document.body
    // 配置观察选项
    const config = {
        childList: true,
        subtree: true,
    }
    const observer = new MutationObserver((mutationsList, observer) => {
        let htmlContent = document.documentElement.innerHTML
        console.log(
            'window.open has been overridden to open in the current page.'
        )
        for (const mutation of mutationsList) {
            if (
                mutation.type === 'childList' &&
                htmlContent.includes('_blank')
            ) {
                const links = document.querySelectorAll('a[target="_blank"]')
                links.forEach((link) => {
                    link.addEventListener('click', function (event) {
                        event.preventDefault()
                        window.location.href = link.href
                    })
                })
            }
        }
    })
    observer.observe(targetNode, config)
})
// main.js

<!-- real_estate_management_system_2496/frontend/js/main.js -->
document.addEventListener('DOMContentLoaded', function() {
    // 初始化数据存储
    if (!localStorage.getItem('realEstateData')) {
        localStorage.setItem('realEstateData', JSON.stringify([]));
    }

    // 保存不动产数据
    document.getElementById('saveBtn').addEventListener('click', savePropertyData);
    
    // 加载数据表格
    loadDataTable();

    // 文件选择事件
    document.getElementById('scanFile').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            document.getElementById('fileName').textContent = file.name;
            
            // 显示识别状态
            const previewContainer = document.getElementById('previewContainer');
            previewContainer.innerHTML = `
                <div class="text-center">
                    <div class="inline-block loading mb-2"></div>
                    <p class="text-gray-700">正在识别文件内容...</p>
                </div>
            `;

            const reader = new FileReader();
            reader.onload = function(event) {
                if (file.type === 'application/pdf') {
                    previewContainer.innerHTML = `
                        <div class="text-center">
                            <i class="fas fa-file-pdf text-5xl text-red-500 mb-2"></i>
                            <p class="text-gray-700">PDF文件预览</p>
                            <p class="text-sm text-gray-500">${file.name}</p>
                        </div>
                    `;
                } else {
                    previewContainer.innerHTML = `
                        <img src="${event.target.result}" class="preview-image max-h-64 cursor-pointer" id="previewImage">
                        <div class="preview-actions">
                            <button id="zoomInBtn" class="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                                <i class="fas fa-search-plus text-gray-700"></i>
                            </button>
                            <button id="zoomOutBtn" class="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                                <i class="fas fa-search-minus text-gray-700"></i>
                            </button>
                            <button id="rotateBtn" class="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                                <i class="fas fa-redo text-gray-700"></i>
                            </button>
                        </div>
                    `;
                    
                    // 图片操作按钮
                    const previewImage = document.getElementById('previewImage');
                    let scale = 1;
                    let rotation = 0;

                    document.getElementById('zoomInBtn').addEventListener('click', function(e) {
                        e.stopPropagation();
                        scale += 0.1;
                        previewImage.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
                    });

                    document.getElementById('zoomOutBtn').addEventListener('click', function(e) {
                        e.stopPropagation();
                        if (scale > 0.5) {
                            scale -= 0.1;
                            previewImage.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
                        }
                    });

                    document.getElementById('rotateBtn').addEventListener('click', function(e) {
                        e.stopPropagation();
                        rotation += 90;
                        previewImage.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
                    });

                    // 点击预览大图
                    previewImage.addEventListener('click', function() {
                        document.getElementById('modalImage').src = event.target.result;
                        document.getElementById('imageModal').classList.remove('hidden');
                    });
                }
                
                // 模拟OCR识别
                setTimeout(() => {
                    const ocrData = simulateOCR(file.name);
                    Object.keys(ocrData).forEach(key => {
                        const element = document.getElementById(key);
                        if (element) element.value = ocrData[key];
                    });

                    // 显示识别完成状态
                    const statusDiv = document.createElement('div');
                    statusDiv.className = 'mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm';
                    statusDiv.innerHTML = `
                        <i class="fas fa-check-circle mr-2"></i>
                        识别完成，请核对以下字段：
                        <div class="mt-2 grid grid-cols-2 gap-2">
                            <div><span class="font-medium">不动产权号:</span> ${ocrData.propertyNumber}</div>
                            <div><span class="font-medium">权利人:</span> ${ocrData.owner}</div>
                            <div><span class="font-medium">坐落:</span> ${ocrData.location}</div>
                            <div><span class="font-medium">面积:</span> ${ocrData.area}㎡</div>
                        </div>
                    `;
                    previewContainer.appendChild(statusDiv);
                }, 1500);
            };
            reader.readAsDataURL(file);
        }
    });
});

// 改进的OCR模拟识别函数
function simulateOCR(filename) {
    const generatePropertyNumber = () => {
        const prefixes = ['京', '沪', '粤', '苏', '浙'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const year = new Date().getFullYear();
        const randomNum = Math.floor(1000000 + Math.random() * 9000000);
        return `${prefix}(${year})不动产权第${randomNum}号`;
    };

    const generateLocation = () => {
        const cities = {
            '京': ['朝阳区', '海淀区', '西城区', '东城区'],
            '沪': ['浦东新区', '徐汇区', '黄浦区', '静安区'],
            '粤': ['广州市天河区', '深圳市南山区', '珠海市香洲区'],
            '苏': ['南京市鼓楼区', '苏州市工业园区', '无锡市梁溪区'],
            '浙': ['杭州市西湖区', '宁波市鄞州区', '温州市鹿城区']
        };
        
        const prefix = generatePropertyNumber().substring(0, 1);
        const city = cities[prefix] ? cities[prefix][Math.floor(Math.random() * cities[prefix].length)] : '北京市朝阳区';
        const streets = ['建国路', '中关村大街', '金融大街', '王府井大街', '南京路', '淮海路', '深南大道'];
        const street = streets[Math.floor(Math.random() * streets.length)];
        const number = Math.floor(1 + Math.random() * 200);
        
        return `${city}${street}${number}号`;
    };

    const generateArea = () => {
        const types = {
            '住宅': () => (50 + Math.random() * 150).toFixed(2),
            '商业': () => (30 + Math.random() * 70).toFixed(2),
            '办公': () => (80 + Math.random() * 120).toFixed(2),
            '工业': () => (200 + Math.random() * 800).toFixed(2)
        };
        
        const purpose = ['住宅', '商业', '办公', '工业'][Math.floor(Math.random() * 4)];
        return {
            purpose,
            area: types[purpose]()
        };
    };

    const areaData = generateArea();
    
    return {
        propertyNumber: generatePropertyNumber(),
        owner: ["张", "李", "王", "刘", "陈"][Math.floor(Math.random() * 5)] + 
               ["三", "四", "五", "小明", "小红", "建国", "建军"][Math.floor(Math.random() * 7)],
        coOwnership: ["单独所有", "共同共有", "按份共有"][Math.floor(Math.random() * 3)],
        location: generateLocation(),
        unitNumber: "110105" + new Date().getFullYear() + Math.floor(1000 + Math.random() * 9000),
        rightType: "国有建设用地使用权/房屋所有权",
        rightNature: ["出让/市场化商品房", "划拨/经济适用房", "出让/商业"][Math.floor(Math.random() * 3)],
        purpose: areaData.purpose,
        area: areaData.area,
        usagePeriod: `${new Date().getFullYear() - 10}-05-20至${new Date().getFullYear() + 50}-05-19`,
        otherConditions: "无",
        scanFile: filename,
        createdAt: new Date().toISOString()
    };
}

// 保存不动产数据
function savePropertyData() {
    const formData = {
        propertyNumber: document.getElementById('propertyNumber').value,
        owner: document.getElementById('owner').value,
        coOwnership: document.getElementById('coOwnership').value,
        location: document.getElementById('location').value,
        unitNumber: document.getElementById('unitNumber').value,
        rightType: document.getElementById('rightType').value,
        rightNature: document.getElementById('rightNature').value,
        purpose: document.getElementById('purpose').value,
        area: document.getElementById('area').value,
        usagePeriod: document.getElementById('usagePeriod').value,
        otherConditions: document.getElementById('otherConditions').value,
        scanFile: document.getElementById('scanFile').files[0] ? 
                 document.getElementById('scanFile').files[0].name : null,
        createdAt: new Date().toISOString()
    };

    // 验证必填字段
    if (!formData.propertyNumber || !formData.owner || !formData.location) {
        alert('请填写不动产权号、权利人和坐落等必填信息！');
        return;
    }

    // 验证不动产权号格式
    const propertyNumberRegex = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]|^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z]\d{6}$/;
    if (!propertyNumberRegex.test(formData.propertyNumber)) {
        if (!confirm('不动产权号格式可能不正确，是否继续保存？')) {
            return;
        }
    }

    // 获取现有数据
    const existingData = JSON.parse(localStorage.getItem('realEstateData'));
    
    // 检查是否已存在相同权号的记录
    const existingIndex = existingData.findIndex(item => 
        item.propertyNumber === formData.propertyNumber
    );

    if (existingIndex >= 0) {
        // 更新现有记录
        existingData[existingIndex] = formData;
    } else {
        // 添加新记录
        existingData.push(formData);
    }

    // 保存到本地存储
    localStorage.setItem('realEstateData', JSON.stringify(existingData));
    
    // 重新加载表格
    loadDataTable();
    
    // 显示成功消息
    const alertDiv = document.createElement('div');
    alertDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    alertDiv.innerHTML = '<i class="fas fa-check-circle mr-2"></i> 不动产数据已保存！';
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.classList.add('opacity-0', 'transition-opacity', 'duration-500');
        setTimeout(() => alertDiv.remove(), 500);
    }, 3000);
}

// 加载数据表格
function loadDataTable() {
    const data = JSON.parse(localStorage.getItem('realEstateData'));
    const tableBody = document.getElementById('dataTable');
    
    tableBody.innerHTML = '';
    
    if (data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="py-4 text-center text-gray-500">暂无数据</td>
            </tr>
        `;
        return;
    }
    
    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        row.innerHTML = `
            <td class="py-3 px-4">${item.propertyNumber}</td>
            <td class="py-3 px-4">${item.owner}</td>
            <td class="py-3 px-4">${item.location}</td>
            <td class="py-3 px-4">
                <button onclick="editProperty('${index}')" class="text-blue-500 hover:text-blue-700 mr-3">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteProperty('${index}')" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// 编辑不动产数据
window.editProperty = function(index) {
    const data = JSON.parse(localStorage.getItem('realEstateData'));
    const item = data[index];
    
    // 填充表单
    document.getElementById('propertyNumber').value = item.propertyNumber;
    document.getElementById('owner').value = item.owner;
    document.getElementById('coOwnership').value = item.coOwnership;
    document.getElementById('location').value = item.location;
    document.getElementById('unitNumber').value = item.unitNumber;
    document.getElementById('rightType').value = item.rightType;
    document.getElementById('rightNature').value = item.rightNature;
    document.getElementById('purpose').value = item.purpose;
    document.getElementById('area').value = item.area;
    document.getElementById('usagePeriod').value = item.usagePeriod;
    document.getElementById('otherConditions').value = item.otherConditions;
    
    // 显示预览图
    const previewContainer = document.getElementById('previewContainer');
    if (item.scanFile) {
        if (item.scanFile.includes('.pdf')) {
            previewContainer.innerHTML = `
                <div class="text-center">
                    <i class="fas fa-file-pdf text-5xl text-red-500 mb-2"></i>
                    <p class="text-gray-700">PDF文件预览</p>
                    <p class="text-sm text-gray-500">${item.scanFile}</p>
                </div>
            `;
        } else {
            previewContainer.innerHTML = `
                <div class="text-center">
                    <i class="fas fa-file-image text-5xl text-blue-500 mb-2"></i>
                    <p class="text-gray-700">图片文件预览</p>
                    <p class="text-sm text-gray-500">${item.scanFile}</p>
                </div>
            `;
        }
    }
    
    // 滚动到表单
    document.getElementById('propertyNumber').scrollIntoView({ behavior: 'smooth' });
};

// 删除不动产数据
window.deleteProperty = function(index) {
    if (confirm('确定要删除这条不动产记录吗？')) {
        const data = JSON.parse(localStorage.getItem('realEstateData'));
        data.splice(index, 1);
        localStorage.setItem('realEstateData', JSON.stringify(data));
        loadDataTable();
    }
};

// 数据备份
window.backupData = function() {
    const data = localStorage.getItem('realEstateData');
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `real_estate_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('数据备份成功！');
};

// 数据恢复
window.restoreData = function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = event => {
            try {
                const data = JSON.parse(event.target.result);
                if (Array.isArray(data)) {
                    localStorage.setItem('realEstateData', JSON.stringify(data));
                    loadDataTable();
                    alert('数据恢复成功！');
                } else {
                    alert('无效的备份文件格式！');
                }
            } catch (error) {
                alert('解析备份文件失败：' + error.message);
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
};

// end main.js
