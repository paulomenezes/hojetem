<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCourseUnitClassesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('course_unit_classes', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->text('description');
            $table->string('duration');
            $table->integer('id_unit')->unsigned();
            $table->foreign('id_unit')->references('id')->on('units')->onDelete('cascade')->onUpdate('cascade');
            $table->integer('id_type')->unsigned();
            $table->foreign('id_type')->references('id')->on('class_types')->onDelete('cascade')->onUpdate('cascade');
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
        Schema::drop('course_unit_classes');
    }
}
