<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePermissionActionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('permission_actions', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('id_permission')->unsigned();
            $table->foreign('id_permission')->references('id')->on('permissions')->onDelete('cascade')->onUpdate('cascade');
            $table->integer('id_action')->unsigned();
            $table->foreign('id_action')->references('id')->on('actions')->onDelete('cascade')->onUpdate('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('permission_actions');
    }
}
