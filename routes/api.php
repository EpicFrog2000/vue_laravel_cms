<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\CmsController;

Route::post('/api/updateCmsData', [CmsController::class,'updateCmsData'])->name('updateCmsData');

Route::get('/api/getFilesList', [CmsController::class,'getFilesList'])->name('getFilesList');

Route::get('/api/getPagesList', [CmsController::class,'getPagesList'])->name('getPagesList');

Route::get('/api/getPageSettings', [CmsController::class,'getPageSettings'])->name('getPageSettings');

Route::post('/api/savePageSettings', [CmsController::class,'savePageSettings'])->name('savePageSettings');


Route::post('/api/uploadFile', [CmsController::class,'uploadFile'])->name('uploadFile');
