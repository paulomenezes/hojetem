<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProfilePermissionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('profile_permissions', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('id_profile')->unsigned();
            $table->foreign('id_profile')->references('id')->on('profiles')->onDelete('cascade')->onUpdate('cascade');
            $table->integer('id_permission')->unsigned();
            $table->foreign('id_permission')->references('id')->on('permissions')->onDelete('cascade')->onUpdate('cascade');
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
        Schema::drop('profile_permissions');
    }
}
