exports.install = function (Vue) {
    Vue.prototype.sureView = function (func, arg, msg) {
        this.$confirm('此操作将永久删除' + '<strong style="color: red;">' + msg + '</strong>' + ',是否继续?', '提示', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            func(arg);
        }).catch(() => {
        });
    };
    Vue.prototype.messageShow = function (_this, response) {
        if (response.data['code'] < 210) {
            if (response.data['msg'] != ''){
                _this.$notify({
                    title: '成功',
                    message: response.data['msg'],
                    type: 'success',
                });
            }
        }else{
            _this.$notify({
                title: '警告',
                message: response.data['msg'],
                type: 'warning',
            });
        }
        return true
    };
    Vue.prototype.errorMessageShow = function (_this, response) {
        _this.$notify.error({
            title: '错误',
            message: response.data['msg']
        })
    };
};